import { UITransactionType, TxActionsEnum, TxActionCategoryEnum } from 'helpers/types';

const getTransactionFunction = (transaction: UITransactionType) => {
  let transactionAction = 'Transaction';
  if (transaction.action && transaction.action.name && transaction.action.category) {
    switch (true) {
      case Boolean(
        transaction.action.category === TxActionCategoryEnum.esdtNft &&
          transaction.action.name === TxActionsEnum.transfer
      ):
        transactionAction = 'ESDTNFTTransfer';
        break;
      default:
        transactionAction = transaction.action.name;
        break;
    }
  }

  return transactionAction;
};

export default getTransactionFunction;
