import { z } from 'astro/zod';
import { schema as peep } from './peep';
import { schema as owl } from './owl';
import { schema as pecker } from './pecker';
import { schema as lark } from './lark';
import { schema as jay } from './jay';
import { schema as finch } from './finch';
import { schema as sparrow } from './sparrow';

/**
 * The objects that show each agent page's problem, one YAML per agent and per locale in
 * src/content/agents-probleme/. Each agent shows different things, hence its own schema, picked
 * by `agent`. The title and text of the problem are in the agent's page block.
 */
export const schema = z.discriminatedUnion('agent', [peep, owl, pecker, lark, jay, finch, sparrow]);
export type Probleme = z.infer<typeof schema>;
export type ProblemeDe<A extends Probleme['agent']> = Extract<Probleme, { agent: A }>;
