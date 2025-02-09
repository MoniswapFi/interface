import { NFTMetadata } from "@/types";
import { jsonrepair } from "jsonrepair";

export class TokenURIReader {
  static async openURI(uri: string): Promise<NFTMetadata> {
    try {
      const resp = await fetch(uri);
      const respData = await resp.arrayBuffer();
      const metadata = JSON.parse(jsonrepair(Buffer.from(respData).toString()));
      return metadata;
    } catch (error: any) {
      return Promise.reject(error);
    }
  }
}
