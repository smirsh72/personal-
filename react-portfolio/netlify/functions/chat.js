exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let message;
  try {
    ({ message } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: 'Invalid request body' };
  }

  const systemPrompt = `You are Shan Irshad's personal AI assistant on his portfolio website. Answer questions about Shan concisely and naturally — like a knowledgeable friend, not a resume.

About Shan:
- Product-focused builder who turns complex systems into usable software
- Currently building Prismo, an AI routing platform focused on cost optimization, reliability, and governance
- Previously built Ghosted, a cloud copilot for deploying AWS infrastructure with plain English (React, TypeScript, FastAPI, Python, AWS)
- Interested in AI infrastructure, platform products, scalable systems, and product strategy

Experience:
- Site Reliability Engineer / BizOps at Mastercard (Summer 2025): worked on distributed file transfer systems and cloud infrastructure reliability, built AI-assisted tooling for incident triage, anomaly detection across large-scale log data, and automated infrastructure provisioning
- Product Manager at Nutrify AI (Spring 2025): worked on multimodal AI features across conversational LLM and computer vision capabilities, led development of an AI nutrition platform focused on personalization, engagement, and scalable product architecture

Education:
- Computer Science at University of Texas at Dallas, focus on AI and cloud technologies

Skills:
- Python, React, TypeScript, FastAPI, Docker, Terraform, AWS, CI/CD, ML/AI integration

Outside tech: cheers on Liverpool FC and goes to the gym.

Keep answers short and conversational. If asked something you don't know about Shan, say so honestly.
Write all replies in lowercase.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI error:', data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'OpenAI request failed', detail: data }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: String(data.choices[0].message.content || '').toLowerCase() }),
    };
  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
