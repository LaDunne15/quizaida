export default ({action}) => {
    return (
        <input type="button" value="X" className="close-btn" onClick={() => action()}/>
    )
}