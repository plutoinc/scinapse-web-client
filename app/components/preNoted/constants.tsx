enum BLOCKED_BUBBLE_CONTEXT_TYPE {
  JOIN_SCINAPSE = '1',
  WHEN_YOU_JOIN_SCINAPSE = '2',
  ENJOY_UNLIMITED_SCINAPSE = '3',
}
interface BlockedBubbleKeywords {
  verb: string;
  noun: string;
}

interface BlockedBubbleContextStructure {
  title: string;
  mainText: string;
}

const blockedBubbleVerbAndNoun: { [key: string]: BlockedBubbleKeywords } = {
  downloadPdf: { verb: 'download', noun: 'PDF' },
  viewMorePDF: { verb: 'view', noun: 'PDF' },
  addToCollection: { verb: 'save to', noun: 'Collection' },
};

export function getBlockedBubbleContext(userGroupName: string, buttonAction: string): BlockedBubbleContextStructure {
  const contextVerbAndNoun = blockedBubbleVerbAndNoun[buttonAction];
  switch (userGroupName) {
    case BLOCKED_BUBBLE_CONTEXT_TYPE.JOIN_SCINAPSE:
      return {
        title: `Do you want to ${contextVerbAndNoun.verb} ${contextVerbAndNoun.noun}?`,
        mainText: `Join Scinapse to ${contextVerbAndNoun.verb} ${contextVerbAndNoun.noun}. It's free!`,
      };

    case BLOCKED_BUBBLE_CONTEXT_TYPE.WHEN_YOU_JOIN_SCINAPSE:
      return {
        title: `Join Scinapse to ${contextVerbAndNoun.verb} ${contextVerbAndNoun.noun}`,
        mainText: `When you join Scinapse, you can ${contextVerbAndNoun.verb} any ${contextVerbAndNoun.noun}.`,
      };

    case BLOCKED_BUBBLE_CONTEXT_TYPE.ENJOY_UNLIMITED_SCINAPSE:
      const capitalizedVerb = contextVerbAndNoun.verb.charAt(0).toUpperCase() + contextVerbAndNoun.verb.slice(1);
      return {
        title: `${capitalizedVerb} ${contextVerbAndNoun.noun} with a Scinapse account`,
        mainText: `Enjoy unlimited Scinapse with a Scinapse account.`,
      };
  }
  return { title: '', mainText: '' };
}
