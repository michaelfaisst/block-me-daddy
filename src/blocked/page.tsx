const BlockedPage = () => {
    return (
        <div className="container flex flex-col items-center justify-center h-screen">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 block">
                Hell no!
            </h1>

            <p className="text-lg text-gray-500 mb-1 text-center">
                You've told me you don't want to see this page again. So I'm not
                showing it to you.
            </p>

            <p className="text-lg font-bold mb-8 text-center">
                Sorry, not sorry.
            </p>

            <img src="https://media3.giphy.com/media/cf8wLYdRWjM6A/giphy.gif?cid=ecf05e47cxm4gtpsexiudbi68b1g7j8bghfn1j0sp9bi78di&ep=v1_gifs_search&rid=giphy.gif&ct=g" />
        </div>
    );
};

export default BlockedPage;
