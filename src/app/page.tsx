import { BTC } from "./_components/btc";
import Header from "./_components/header";
import { Land } from "./_components/land";
import { Tile } from "./_components/tile";

export default async function Home() {

  return (
    <main className="">
        <Header />
        <Land />
        {/*<div className="grid grid-cols-5 max-w-6xl mx-auto px-8 gap-4">
            <Tile className="col-span-3"><BTC /></Tile>
            <Tile className="col-span-2">hi</Tile>
            <Tile className="">there</Tile>
        </div>*/}
    </main>
  );
}
