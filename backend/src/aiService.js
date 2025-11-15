/**
 * AI Service for Tarot Interpretations
 * Connects to qwen3:30b via Ollama for personalized readings
 */

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL_NAME = process.env.AI_MODEL || 'qwen3:30b';

/**
 * Generate AI-powered tarot interpretation
 * @param {string} spreadName - Name of the spread (e.g., "Celtic Cross")
 * @param {Array} cards - Array of card objects with position, card, orientation, meaning
 * @returns {Promise<Object>} AI interpretation with summary and insights
 */
export async function interpretReading(spreadName, cards) {
  try {
    // Build the prompt for the AI
    const prompt = buildInterpretationPrompt(spreadName, cards);

    console.log('🧠 Sending interpretation request to qwen3:30b...');
    console.log(`Model: ${MODEL_NAME} @ ${OLLAMA_URL}`);

    // Call Ollama API
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.8, // Creative but focused
          top_p: 0.9,
          max_tokens: 800
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.response;

    // Parse the AI response
    const interpretation = parseAIResponse(rawText);

    console.log('✨ AI interpretation generated successfully!');

    return interpretation;

  } catch (error) {
    console.error('❌ AI interpretation error:', error);

    // Fallback to basic interpretation
    return {
      summary: generateFallbackInterpretation(spreadName, cards),
      insights: cards.map(card =>
        `${card.position}: The ${card.card} ${card.orientation === 'Reversed' ? '(reversed)' : ''} brings energy of ${card.meaning.toLowerCase()}`
      ).slice(0, 3), // Top 3 insights
      aiGenerated: false
    };
  }
}

/**
 * Build the AI prompt for tarot interpretation
 */
function buildInterpretationPrompt(spreadName, cards) {
  const cardDescriptions = cards.map(card =>
    `- ${card.position}: ${card.card} (${card.orientation}) - ${card.meaning}`
  ).join('\n');

  return `You are an expert tarot reader with deep knowledge of symbolism, intuition, and spiritual guidance.

A querent has drawn a ${spreadName} spread. Here are the cards:

${cardDescriptions}

Provide a comprehensive, insightful interpretation of this reading. Your response should:

1. Start with a 2-3 sentence summary of the overall theme and message of the reading
2. Provide 3-5 key insights that weave the cards together into a cohesive narrative
3. Be empowering, insightful, and actionable
4. Use mystical yet accessible language
5. Consider how the cards interact with each other in their positions

Format your response as:
SUMMARY: [Your 2-3 sentence summary]

INSIGHTS:
- [First insight]
- [Second insight]
- [Third insight]
- [etc.]

Begin your interpretation:`;
}

/**
 * Parse the AI response into structured format
 */
function parseAIResponse(rawText) {
  try {
    // Look for SUMMARY and INSIGHTS sections
    const summaryMatch = rawText.match(/SUMMARY:(.+?)(?=INSIGHTS:|$)/is);
    const insightsMatch = rawText.match(/INSIGHTS:(.+?)$/is);

    let summary = summaryMatch ? summaryMatch[1].trim() : rawText.substring(0, 300);
    let insights = [];

    if (insightsMatch) {
      const insightsText = insightsMatch[1];
      insights = insightsText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-') || line.startsWith('•') || line.match(/^\d+\./))
        .map(line => line.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, ''))
        .filter(line => line.length > 10);
    }

    // If parsing failed, just split the text intelligently
    if (!summary || insights.length === 0) {
      const sentences = rawText.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);
      summary = sentences.slice(0, 2).join('. ') + '.';
      insights = sentences.slice(2, 7);
    }

    return {
      summary,
      insights,
      aiGenerated: true
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return {
      summary: rawText.substring(0, 300),
      insights: [],
      aiGenerated: true
    };
  }
}

/**
 * Generate a basic fallback interpretation when AI is unavailable
 */
function generateFallbackInterpretation(spreadName, cards) {
  const themes = extractThemes(cards);
  const orientation = cards.filter(c => c.orientation === 'Reversed').length > cards.length / 2 ? 'reversed' : 'upright';

  let interpretation = `Your ${spreadName} reading reveals `;

  if (orientation === 'reversed') {
    interpretation += 'a time of internal reflection and transformation. Many reversed cards suggest ';
    interpretation += 'that you\'re being called to look inward and release what no longer serves you. ';
  } else {
    interpretation += 'a powerful forward momentum. The upright cards indicate ';
    interpretation += 'that energies are flowing in your favor and opportunities are presenting themselves. ';
  }

  interpretation += `The presence of ${themes.join(', ')} suggests that these areas of life are particularly significant right now.`;

  return interpretation;
}

/**
 * Extract major themes from the cards
 */
function extractThemes(cards) {
  const themes = [];

  // Check for major arcana
  const hasMajor = cards.some(c => c.card.startsWith('The '));
  if (hasMajor) themes.push('major life transitions');

  // Check for suits
  const hasCups = cards.some(c => c.card.includes('Cups'));
  const hasWands = cards.some(c => c.card.includes('Wands'));
  const hasSwords = cards.some(c => c.card.includes('Swords'));
  const hasPentacles = cards.some(c => c.card.includes('Pentacles'));

  if (hasCups) themes.push('emotions and relationships');
  if (hasWands) themes.push('passion and creativity');
  if (hasSwords) themes.push('mental clarity and challenges');
  if (hasPentacles) themes.push('material concerns and manifestation');

  return themes.length > 0 ? themes : ['spiritual growth', 'personal development'];
}

export default interpretReading;
