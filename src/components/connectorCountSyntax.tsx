import React from "react";

const ConnectorCountSyntax = ({currentPrefix, setCurrentPrefix, availablePrefixes, setAvailablePrefixes}: {currentPrefix: any; setCurrentPrefix: any; availablePrefixes: any; setAvailablePrefixes: any}) => {
  
  React.useEffect(() => {
    updateExistingConnectorNames();
  }, []);

  interface BoardItemWithAlt {
    alt: string;
  } 

  // Funktion zum Sammeln aller existierenden Connector-Namen
  const getAllConnectorNames = async () => {
    const items = await miro.board.get({ type: 'connector' });
  
    const names = items.map(item => {
      let caption = item.captions?.[0]?.content;
  
      // Entferne HTML-Tags aus der Beschriftung
      if (caption) {
        caption = caption.replace(/<[^>]*>/g, '');
      }
      const processedCaption = caption && caption.startsWith(currentPrefix) ? caption.replace(currentPrefix, '') : null;
      return processedCaption;
    }).filter(n => n !== null).map(n => {
      return parseInt(n as string, 10);
    });
  
    return names;
  };
  
  // Funktion zum Finden der niedrigsten noch nicht verwendeten Nummer
  const findLowestUnusedNumber = (usedNumbers: (number | null)[]) => {
    let number = 1;
    while (usedNumbers.includes(number)) {
      number++;
    }
    return number;
  };

  //Automatische Nummerierung der Connectoren, die von Akteuren ausgehen
  miro.board.ui.on('items:create', async (event) => {
    for (const connector of event.items) {
      if (connector.type === 'connector') {
        try {
          const startItem = await miro.board.getById((connector as any).start.item) as BoardItemWithAlt;
          const endItem = await miro.board.getById((connector as any).end.item) as BoardItemWithAlt;
          // Check if start item is actor and end item is not actor
          if (startItem.alt.startsWith('Akteur') && !endItem.alt.startsWith('Akteur')) {
            const existingConnectorNames = await getAllConnectorNames();
            const connectorName = findLowestUnusedNumber(existingConnectorNames);
            
            // Set connector caption
            connector.captions = [{
              content: `${currentPrefix}${connectorName}`,
              position: 0.05,
              textAlignVertical: 'top',
            }];

            connector.shape= 'straight';
            connector.style.color = "#F99901";
            connector.style.fontSize = 64;
  
            // Sync changes to connector
            await connector.sync();
            console.log('Updated connector:', connector);
          }
        } catch (error) {
          console.error('Error updating connector:', error);
        }
      }
    }
  });

  // Funktion zum Hinzufügen einer neuen Zählweise
  const addNewPrefix = () => {
    const allPrefixes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const nextAvailablePrefix = allPrefixes.find(prefix => !availablePrefixes.includes(prefix));
    if (nextAvailablePrefix) {
      setAvailablePrefixes((prevPrefixes: string[]) => [...prevPrefixes, nextAvailablePrefix]);
    }
  };

  //App mit Connectoren auf dem Board synchronisieren
  const updateExistingConnectorNames = async () => {
    const items = await miro.board.get({ type: 'connector' });
    const existingNames = items.map(item => {
      const content = item.captions?.[0]?.content;
      return content ? content.replace(/<[^>]+>/g, '') : null;
    }).filter(name => name);    
    // Sammeln der verwendeten Präfixe und der höchsten Nummer für jedes Präfix
    let maxNumberByPrefix: { [key: string]: number } = {};
      existingNames.forEach(name => {
      if (name) {
        const match = name.match(/^([A-Z])(\d+)$/);
        if (match) {
          const [, prefix, number] = match;
          const num = parseInt(number, 10);
          maxNumberByPrefix[prefix] = Math.max(maxNumberByPrefix[prefix] || 0, num);
        }
      }
    });
  
    // Aktualisiere die Liste der verfügbaren Präfixe
    const existingPrefixes = Object.keys(maxNumberByPrefix);
    setAvailablePrefixes((prevPrefixes: string[]) => {
      // Füge nur neue Präfixe hinzu, die noch nicht in der Liste sind
      const newPrefixes = existingPrefixes.filter(prefix => !prevPrefixes.includes(prefix));
      return [...prevPrefixes, ...newPrefixes];
    });
  
    // Überprüfen, ob das aktuelle Präfix aktualisiert werden muss
    if (existingPrefixes.length > 0 && !existingPrefixes.includes(currentPrefix)) {
      setCurrentPrefix(existingPrefixes[0]);
    }
  };

  // Funktion zum Aktualisieren der Beschriftungen aller Connectoren
  const updateConnectorCaptions = async () => {
    const items = await miro.board.get({ type: 'connector' });
    const sortedConnectors = items
      .map(item => ({
        object: item,
        caption: item.captions?.[0]?.content?.replace(/<[^>]*>/g, '') ?? '',
      }))
      .filter(item => item.caption && item.caption.startsWith(currentPrefix))
      .sort((a, b) => {
        const numA = parseInt(a.caption.replace(currentPrefix, ''), 10);
        const numB = parseInt(b.caption.replace(currentPrefix, ''), 10);
        return numA - numB;
      });
  
    let currentNumber = 1;
    for (const connector of sortedConnectors) {
      const expectedCaption = `${currentPrefix}${currentNumber}`;
      if (connector.caption !== expectedCaption) {
        // Update connector caption
        connector.object.captions = [{
          content: expectedCaption,
          position: 0.05,
          textAlignVertical: 'top',
        }];
        // Sync changes to connector
        await connector.object.sync();
      }
      currentNumber++;
    }
  };

  return (
    <div>
      <h3>Change Connector Caption </h3>
      <button onClick={addNewPrefix}>Neue Zählweise hinzufügen</button>
      <select onChange={(e) => setCurrentPrefix(e.target.value)}>
        {availablePrefixes.map((prefix: string) => (
          <option key={prefix} value={prefix}>{prefix}</option>
        ))}
      </select>
      <button onClick={updateConnectorCaptions} style={{ marginTop: '20px' }}>Update Connector Captions</button>
    </div>
  )
}

export default ConnectorCountSyntax