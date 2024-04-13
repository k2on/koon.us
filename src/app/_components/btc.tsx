const url = "https://companiesmarketcap.com/assets-by-market-cap/";


export async function BTC() {
    const resp = await fetch(url);
    const html = await resp.text();
    const table = html.split("<tbody>")[1]!.split("</tbody>")[0]!;

    const rows = table.split("</tr>");
    rows.pop();

    function parseRow(r: string) {
        const between = (to: string, from: string) => r.split(to)[1]!.split(from)[0]! || "";
        return {
            logo: "https://companiesmarketcap.com/" + between('src="', '"'),
            name: between('<div class="company-name">', '<'),
            code: between('></span>', '<'),
            marketcap: between('<td class="td-right" data-sort="', '"'),
        }
    }


    const assets = rows.map(parseRow)
    const btcIdx = assets.findIndex((a, i) => a.code == "BTC");
    const next = assets[btcIdx + 1];
    const prev = assets[btcIdx - 1];

    

    return <div>{next?.name}</div>;
}
