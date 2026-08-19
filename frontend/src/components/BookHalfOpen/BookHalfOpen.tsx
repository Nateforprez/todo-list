import { useEffect } from 'react';
import './BookHalfOpen.css'
import chevronDown from '../../assets/chevron-down-solid-full.svg';

function BookHalfOpen() {
    
    useEffect(() => {
        const itemsLeft = document.querySelectorAll<HTMLElement>('.page-break-left');  
        itemsLeft.forEach((item, index) => {
            const baseHeight = 97; 
            const increase = index; 
            item.style.height = `${baseHeight + increase}%`; 
        }); 

        const itemsRight = document.querySelectorAll<HTMLElement>('.page-break-right');  
        itemsRight.forEach((item, index) => {
            const baseHeight = 97; 
            const increase = index; 
            item.style.height = `${baseHeight + increase}%`; 
        }); 
        
        const horizontalItemsLeft = document.querySelectorAll<HTMLElement>('.horizontal-page-breaks-left'); 
        horizontalItemsLeft.forEach((item, index) => {
            const baseWidth = 100; 
            const increase = index; 
            item.style.width = `${baseWidth + increase}%`; 
        }); 
        const horizontalItemsRight = document.querySelectorAll<HTMLElement>('.horizontal-page-breaks-right'); 
        horizontalItemsRight.forEach((item, index) => {
            const baseWidth = 100; 
            const increase = index; 
            item.style.width = `${baseWidth + increase}%`; 
        }); 

    }, []); 

    return (
        <>
            <div id="whole-book-wrapper">
                
                <div className="book-wrapper" id="book-wrapper-left">
                    <div className="page-peak" id="page-peak-left">
                        <div className="page-break-left" style={{borderRight: '1px solid white'}}></div>
                        <div className="page-break-left"></div>
                        <div className="page-break-left"></div>
                        <div className="page-break-left" style={{borderLeft: '5px solid rgb(107, 82, 49)'}}></div>
                    </div>

                    <div className="book-content">
                        <div className="horizontal-page-breaks" id="horizontal-left">
                            <div className="horizontal-page-breaks-left"/>
                            <div className="horizontal-page-breaks-left"/>
                            <div className="horizontal-page-breaks-left"/> 
                        </div>
                        <div className="page" id="page-left">
                            <div className="page-line-break"></div>
                            <div className="page-line-break"></div>
                            <div className="page-line-break"></div>
                            <div className="page-line-break"></div>
                            <div className="page-line-break"></div>
                        </div>
                    </div>
                </div>

                <div id="book-column-seperator">

                </div>

                <div className="book-wrapper" id="book-wrapper-right">
                    <div className="page-peak" id="page-peak-right">
                        <div className="page-break-right" style={{borderRight: '1px solid white'}}></div>
                        <div className="page-break-right"></div>
                        <div className="page-break-right"></div>
                        <div className="page-break-right" style={{borderRight: '5px solid rgb(107, 82, 49)'}}></div>
                    </div>

                    <div className="book-content">
                        <div className="horizontal-page-breaks" id="horizontal-right">
                            <div className="horizontal-page-breaks-right"/>
                            <div className="horizontal-page-breaks-right"/>
                            <div className="horizontal-page-breaks-right"/> 
                        </div>
                        <div className="page" id="page-left">
                            <div className="page-line-break">
                                <div className="task-description-layout">
                                    <h1 style={{padding: 0, margin: 0}}>Task Name</h1>
                                    <img src={chevronDown} id="chevron-down-icon" aria-hidden="true"></img>
                                    <button id="edit-task-btn">Edit</button>
                                    <h3 className="visual-task-date">Date here...</h3>
                                </div>
                                <input type="checkbox" id="task-checkbox"></input>
                            </div>
                            <div className="page-line-break"></div>
                            <div className="page-line-break"></div>
                            <div className="page-line-break"></div>
                            <div className="page-line-break"></div>
                        </div>
                    </div>
                </div>


            </div>
        </>
    ); 
}


export default BookHalfOpen 