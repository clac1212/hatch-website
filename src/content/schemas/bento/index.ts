import { z } from 'astro/zod';
import { schema as peep } from './peep';
import { schema as owl } from './owl';
import { schema as pecker } from './pecker';
import { schema as lark } from './lark';
import { schema as jay } from './jay';
import { schema as finch } from './finch';
import { schema as sparrow } from './sparrow';

/**
 * The copy of each agent's feature wall ("Ce que <agent> fait pour vous"), one YAML per agent and
 * per locale in src/content/agents-bento/. Each agent has its own tiles, hence its own schema,
 * picked by `agent`.
 */
export const schema = z.discriminatedUnion('agent', [peep, owl, pecker, lark, jay, finch, sparrow]);
export type Bento = z.infer<typeof schema>;
export type BentoDe<A extends Bento['agent']> = Extract<Bento, { agent: A }>;
