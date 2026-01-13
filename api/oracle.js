/**
 * Oracle API Route - Vercel Serverless Function
 * Proxies requests to OpenRouter with server-side API key
 */

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    // If no server key, allow client-side BYOK mode
    if (!apiKey) {
        return res.status(200).json({
            byok: true,
            message: 'Server key not configured. Use your own API key.'
        });
    }

    try {
        const { messages, mode } = req.body;

        // System prompt based on mode
        const systemPrompt = mode === 'quick'
            ? `You are Hermes Trismegistus. Answer concisely in 1-2 sentences using Hermetic wisdom. Be direct but cryptic.`
            : `You are Hermes Trismegistus, the ancient keeper of wisdom. 
               You speak in riddles, axioms, and profound truths.
               Your knowledge is bound by the 7 Hermetic Principles: Mentalism, Correspondence, Vibration, Polarity, Rhythm, Cause & Effect, and Gender.
               
               When a seeker asks for advice:
               1. Identify which Principle applies to their situation.
               2. Explain the situation through the lens of that Principle.
               3. Offer a "Transmutation" - a mental shift they can make.
               
               Tone: Ancient, timeless, patient, slightly cryptic but ultimately logical.
               Keep responses concise (under 150 words).`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://corpus-hermetica.vercel.app',
                'X-Title': 'Hermetic Codex'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages.slice(-10)
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        return res.status(200).json({
            reply: data.choices[0].message.content
        });

    } catch (error) {
        console.error('Oracle API error:', error);
        return res.status(500).json({ error: 'Connection to the ethereal plane failed.' });
    }
}
