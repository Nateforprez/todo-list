import './BookUnopen.css'; 

interface BookUnopenProps {
    user: string; 
}

function BookUnopen({ user } : BookUnopenProps) {
    return ( 
        <>
            <div id="book-wrapper">
                <div id="book-column"></div>
                <div id="book-content">
                    <div id="golden-border">
                        <h1>Todo-List</h1>
                    </div>
                    <h2 style={{color: 'white'}}>For: {user}</h2>
                </div>
                <div id="page-peak">
                    <div className="page-break"></div>
                    <div className="page-break"></div>
                    <div className="page-break"></div>
                </div>
            </div>
        </>
    ); 
}

export default BookUnopen