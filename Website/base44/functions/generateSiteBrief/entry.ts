import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const clamp = (value, max) => (typeof value === 'string' ? value.slice(0, max) : '');
const boundedList = (value, count = 5, max = 300) =>
  Array.isArray(value)
    ? value.filter((item) => typeof item === 'string').slice(0, count).map((item) => clamp(item, max))
    : [];

const TARGET_BRIEF = {
  moon: 'a permanent lunar surface base (vacuum, 1/6 g, 29.5-day solar day, electrostatically charged angular regolith, no magnetic shielding)',
  mars: 'a crewed Mars landing and exploration site (6 mbar CO2 atmosphere, 0.38 g, perchlorate dust, global dust storms, ~24h39m sol)',
};

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json().catch(() => ({}));

    const name = clamp(payload.name, 120);
    if (!name) {
      return Response.json({ error: 'name is required' }, { status: 400 });
    }

    const target = payload.target === 'moon' ? 'moon' : 'mars';
    const region = clamp(payload.region, 120);
    const summary = clamp(payload.summary, 700);
    const substrate = clamp(payload.substrate, 220);
    const why = boundedList(payload.why, 4);
    const limits = boundedList(payload.limits, 4);

    const prompt = [
      `You are a planetary analogue scientist writing a compact field brief for a mission-planning team evaluating terrestrial analogues for ${TARGET_BRIEF[target]}.`,
      '',
      `Site: ${name}${region ? ` (${region})` : ''}.`,
      summary ? `Characterization: ${summary}` : '',
      substrate ? `Surface materials: ${substrate}` : '',
      why.length ? `Documented strengths: ${why.join(' | ')}` : '',
      limits.length ? `Documented limitations: ${limits.join(' | ')}` : '',
      '',
      'Write a terse, concrete brief for engineers and scientists. No marketing language, no hype, no exclamation marks.',
      'verdict: one or two sentences on what this site is genuinely useful for, and at what physical scale.',
      'transfers: 2-4 specific characteristics or processes that do transfer, each naming the mechanism.',
      'breaks: 2-4 specific ways the analogy fails, including anything gravity, vacuum, pressure or radiation related where relevant.',
      'field_tests: 2-4 concrete field or instrument campaigns worth running at this site, each one sentence.',
      'instruments: 2-4 named instrument types or payloads that would benefit from testing here.',
    ]
      .filter(Boolean)
      .join('\n');

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          verdict: { type: 'string' },
          transfers: { type: 'array', items: { type: 'string' } },
          breaks: { type: 'array', items: { type: 'string' } },
          field_tests: { type: 'array', items: { type: 'string' } },
          instruments: { type: 'array', items: { type: 'string' } },
        },
        required: ['verdict', 'transfers', 'breaks', 'field_tests', 'instruments'],
      },
    });

    return Response.json({ brief: response });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}