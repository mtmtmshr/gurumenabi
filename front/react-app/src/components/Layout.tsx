import React from "react"

interface TITLE {
    title: string
}

const Layout: React.FC<TITLE> = ({ children }) => {
    return (
        <div className="flex items-center flex-col min-h-screen font-mono">
            <header className="w-screen border-b-2">
                <div className="py-8 w-9/12 m-auto">
                    <h2 className="text-2xl">ぐるめなび</h2>
                    <p className="text-base pt-8">条件選択により自動で飲食店を決めちゃう優柔不断向けアプリ</p>
                </div>
            </header>
            <main className="flex flex-1 items-center flex-col w-9/12 pt-8">
                {children}
            </main>
            <footer className="w-full h-12 flex justify-center items-center bg-green-400 mt-8">
                <span>© Masahiro Matsumoto</span>
            </footer>
        </div>
    )
}

export default Layout
