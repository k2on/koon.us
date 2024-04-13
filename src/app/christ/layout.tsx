import Header from "../_components/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return <main>
        <Header />
        <div className="py-4 border-b">
            <img className="w-64 mx-auto" src="https://external-content.duckduckgo.com/iu/?u=https://cfctally.com/uploaded_files/CFCTally.com-logo.png&f=1&nofb=1&ipt=e6b9fcf7b4f5e5aa2720be618ab4249ba06c63dfcdaca1997a32cebb81e25267&ipo=images" />
        </div>
        {children}
    </main>
}

