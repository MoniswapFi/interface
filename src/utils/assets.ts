import { Octokit } from "octokit";
import { isAddress } from "viem";
import { z } from "zod";

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN as string;
const ASSETS_REPO_SLUG = process.env.NEXT_PUBLIC_ASSETS_REPO_SLUG as string;
// Octokit instance
const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Zod types
const TokenlistSchema = z.array(
  z
    .object({
      name: z.string(),
      symbol: z.string(),
      address: z.string().refine((arg) => isAddress(arg)),
      logoURI: z.union([z.string().url().min(1), z.string().base64().min(1)]),
      decimals: z
        .number()
        .int()
        .max(2 ** 8),
      chainId: z.number().int(),
    })
    .strict(),
);

type TokenlistStructure = z.infer<typeof TokenlistSchema>;

export async function getTokenlist(chainId: number) {
  // Get slug, and split
  const slug = ASSETS_REPO_SLUG.split("/");
  const repo = slug[0]; // Repository name
  const path = `${slug[1]}/${slug[2]}/${slug[3]}/${slug[4]}`.replace(
    "{chainId}",
    String(chainId),
  );
  const { data } = await octokit.rest.repos.getContent({
    repo,
    owner: "MoniswapFi",
    path,
  });

  if ("content" in data) {
    // Content as buffer
    const asBuffer = Buffer.from(data.content, "base64");
    // Stringify and parse
    const tokenlist = JSON.parse(asBuffer.toString());
    // Run schema check
    const {
      data: value,
      error,
      success,
    } = TokenlistSchema.safeParse(tokenlist);

    if (!success && error) return Promise.reject(error);
    return !!value
      ? value.sort((a, b) =>
          a.symbol > b.symbol ? 1 : a.symbol < b.symbol ? -1 : 0,
        )
      : ([] as TokenlistStructure);
  }
  return [] as TokenlistStructure;
}
