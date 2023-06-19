function App() {
    const openOptionsPage = () => {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL("options.html"));
        }
    };

    return (
        <div className="w-96 h-32">
            <div>Block me daddy</div>
            <div onClick={openOptionsPage}>Go to options</div>
        </div>
    );
}

export default App;
