import * as React from 'react';
import {createRoot} from 'react-dom/client';
import ImageUpload from './components/imageUpload';
import PutIconOnBoard from './components/putIconOnBoard';
import CheckSyntax from './components/checkSyntax';
import ConnectorCountSyntax from './components/connectorCountSyntax';
import '../src/assets/style.css';

const App: React.FC = () => {

  const [uploadedImages, setUploadedImages] = React.useState<{
    akteure: string[];
    werkobjekte: string[];
  }>({
    akteure: [],
    werkobjekte: [],
  });
  
  //state for current connector caption
  const [currentPrefix, setCurrentPrefix] = React.useState<string>('A');
  const [availablePrefixes, setAvailablePrefixes] = React.useState<string[]>(['A']);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
      <ImageUpload setUploadedImages={setUploadedImages} />
      <ConnectorCountSyntax currentPrefix={currentPrefix} setCurrentPrefix={setCurrentPrefix} availablePrefixes={availablePrefixes} setAvailablePrefixes={setAvailablePrefixes} />
      <PutIconOnBoard uploadedImages={uploadedImages}/>
      <CheckSyntax />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);