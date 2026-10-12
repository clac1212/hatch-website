import { z } from 'astro/zod';
import { schema as peep } from './peep';
import { schema as owl } from './owl';
import { schema as pecker } from './pecker';
import { schema as lark } from './lark';
import { schema as jay } from './jay';
import { schema as finch } from './finch';
import { schema as sparrow } from './sparrow';

/**
 * The copy of the agents' "Exemple d'usage" scenes, one YAML per agent and per locale in
 * src/content/agents-scenes/. Each agent has its own devices and screens, hence its own schema,
 * picked by `agent`. An agent without a scene keeps the Hatch OS window of its `exemple` steps.
 */
export const schema = z.discriminatedUnion('agent', [peep, owl, pecker, lark, jay, finch, sparrow]);
export type Scene = z.infer<typeof schema>;
export type SceneDe<A extends Scene['agent']> = Extract<Scene, { agent: A }>;
