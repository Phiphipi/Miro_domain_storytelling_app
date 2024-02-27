import React from "react";

const CheckSyntax = () => {
  
  React.useEffect(() => {
    checkBoardSyntax();
  }, []);

  //interface for alt attribute (workaround)
  interface BoardItemWithAlt {
    alt: string;
  }

  //Syntax Error Notification
  const syntaxError = {
    title: "Syntax Error: ",
    action: "It is not allowed to connect Actors with Actors.",
  };
  const syntaxNotification = `${syntaxError.title} ${syntaxError.action}`;

  //check for syntax error when connector is created
  miro.board.ui.on('items:create', async (event) => {
    for (const item of event.items) {
      if (item.type === 'connector') {
        try {
          if(!item.start?.item || !item.end?.item) {
            continue;
          }
          const startItem = await miro.board.getById(item.start.item) as unknown as BoardItemWithAlt;
          const endItem = await miro.board.getById(item.end.item) as unknown as BoardItemWithAlt;

          const isStartActor = startItem.alt.startsWith('Akteur');
          const isEndActor = endItem.alt.startsWith('Akteur');

          if (isStartActor && isEndActor) {
            await miro.board.remove(item);
            await miro.board.notifications.showError(syntaxNotification);
          }
        } catch (error) {
          console.error('Fehler beim Überprüfen der Connectoren:', error);
        }
      }
    }
  });
  
  //check all connectors on board for syntax error
  const checkBoardSyntax = async () => {
    const connectors = await miro.board.get({
      type: ['connector'],
    });
    console.log(connectors)
    for (const connector of connectors) {
      const startItem = await miro.board.getById((connector as any).start.item) as BoardItemWithAlt;
      const endItem = await miro.board.getById((connector as any).end.item) as BoardItemWithAlt;

      const isStartActor = startItem.alt.startsWith('Akteur');
      const isEndActor = endItem.alt.startsWith('Akteur');

      if (isStartActor && isEndActor) {
        await miro.board.remove(connector);
        await miro.board.notifications.showError(syntaxNotification);
      }
    }
  }

  return (
    <>
    </>
  )
}

export default CheckSyntax