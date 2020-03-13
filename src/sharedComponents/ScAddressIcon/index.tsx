import { faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useGlobalState } from '../../context';

interface ScAddressIconType {
  initiator: string;
  secondInitiator?: string;
}

const isContract = (initiator: string | undefined, charNum: number) =>
  initiator && charNum > 0 && initiator.startsWith('0'.repeat(charNum));

const ScAddressIcon = ({ initiator, secondInitiator }: ScAddressIconType) => {
  const {
    activeTestnet: { numInitCharactersForScAddress: charNum },
  } = useGlobalState();

  const showIcon = isContract(initiator, charNum) || isContract(secondInitiator, charNum);

  return showIcon ? <FontAwesomeIcon icon={faCode} className="w300 mr-1" /> : null;
};

export default ScAddressIcon;
