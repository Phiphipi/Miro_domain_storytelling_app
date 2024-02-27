import React from "react";

const PutIconOnBoard = ({uploadedImages}: {uploadedImages: any}) => {

  React.useEffect(() => {
    init();
  }, []);

  //load uploaded img to board with click
  //add icon name as text
  //group image and text
  const handleImageSelect = async (imageUrl: string, x: number, y: number , alt: string) => {
    const iconName = prompt("Please enter the name of the icon:", "");
    if (iconName !== null && iconName.trim() !== "") {
      try {
        const createdImage = await miro.board.createImage({
          title: 'Selected Image',
          url: imageUrl,
          x: x, 
          y: y,
          width: 200,
          alt: alt,
        });
        const imageName = await miro.board.createText({
          content: iconName,
          style: {
            color: '#1a1a1a', 
            fillColor: 'transparent', 
            fillOpacity: 1, 
            fontFamily: 'arial', 
            fontSize: 48, 
            textAlign: 'center', 
          },
          x: x,
          y: y+130,
          width: 500,
        });

        const items = [createdImage, imageName];
        //ignore problem, Property 'group' DOES exist on type 'Board<Item>'
        await miro.board.group({ items });

      } catch (error) {
        console.error('Error placing image on Miro board:', error);
      }
    }
  }; 

  //initialise drag and drop function
  //add icon name as text
  //group image and text
  async function init() {
    await miro.board.ui.on('drop', async ({x, y, target}) => {
      if (target.className.includes('miro-draggable')) {
        const imageUrl = target.getAttribute('data-image-url');
        const alt = target.getAttribute('alt');
        const altString = alt?.toString();
        if (imageUrl) {
          const iconName = prompt("Please enter the name of the icon:", "");
          if (iconName !== null && iconName.trim() !== "") {
            const createdImage = await miro.board.createImage({
              url: imageUrl,
              x: x,
              y: y,
              width: 200,
              alt: altString,
            });
            const imageName = await miro.board.createText({
              content: iconName,
              style: {
                color: '#1a1a1a', 
                fillColor: 'transparent', 
                fillOpacity: 1, 
                fontFamily: 'arial', 
                fontSize: 48, 
                textAlign: 'center', 
              },
              x: x,
              y: y+130,
              width: 500,
            });
    
            const items = [createdImage, imageName];
            //ignore problem, Property 'group' DOES exist on type 'Board<Item>'
            await miro.board.group({ items });
          }
        }
      }
    });
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Akteure</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {uploadedImages.akteure.map((image: string, index: number) => (
            <img key={index} src={image} alt={`Akteur ${index + 1}`} onClick={() => handleImageSelect(image, 0, 0, `Akteur ${index + 1}`)} style={{width: "30px", height: "30px", margin: "5px" }} data-image-url={image} className="miro-draggable" />
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Werkobjekte</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {uploadedImages.werkobjekte.map((image: string, index: number) => (
            <img key={index} src={image} alt={`Werkobjekt ${index + 1}`} onClick={() => handleImageSelect(image, 0, 0, `Werkobjekt ${index + 1}`)} style={{width: "30px", height: "30px", margin: "5px" }} data-image-url={image} className="miro-draggable" />
          ))}
        </div>
      </div>
    </div>
  )
}
  
export default PutIconOnBoard