import { Fragment, useState } from "react";
const items = ["Montreal", "Quebec", "Ottawa", "Ontario"];


function ListGroup() {
    const [SelectedIndex, setSelectedIndex] = useState(-1);
    return (
    <>
    <h3>Heading of the List Group</h3>
    <ul className="list-group">
        {items.map((item, index) =>(<li className = {SelectedIndex === index ? "list-group-item active" : "list-group-item"}
        key = {index} onClick={() => setSelectedIndex(index)}>{index+1}. {item}</li>))}
    </ul>
    </>
    );
    
}

export default ListGroup;