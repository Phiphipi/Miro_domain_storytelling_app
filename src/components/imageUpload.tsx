import React from "react";

const ImageUpload = ({setUploadedImages}: {setUploadedImages: any}) => {

  type Category = 'akteure' | 'werkobjekte';

  //state for current category
  const [currentCategory, setCurrentCategory] = React.useState<Category>('akteure');

  // handle uploaded file -> transform in url and add to state
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = event.target.files;
    
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          reader.onload = async (e) => {
            const imageUrl = e.target?.result;
            if (typeof imageUrl === 'string') {
              setUploadedImages((prevImages: { [key in Category]: string[] }) => ({
                ...prevImages,
                [currentCategory]: [...prevImages[currentCategory], imageUrl],
              }));
            }
          };
          reader.readAsDataURL(file);
        }
      }
    };

  return (
    <div>
      <h3>Upload Custom Icons</h3>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
        <select style={{ width: '160px', marginRight: '10px', height: "22.5px" }} onChange={(e) => setCurrentCategory(e.target.value as Category)}>
        <option value="akteure">Akteure</option>
        <option value="werkobjekte">Werkobjekte</option>
        </select>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          style={{ width: '150px' }}
          />
      </div>
    </div>
  )
}
  
export default ImageUpload