export default ({images, setImages}) => {

    return <input type="file" name="" id="" onChange={(e) => setImages([...images, e.target.files[0]])}/>;

}