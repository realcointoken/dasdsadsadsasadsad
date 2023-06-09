import { Flex } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

import { OperationStatus } from '../../../../../network/ergo/api/operations/history/v2/types/BaseOperation';
import { RemoveLiquidityItem } from '../../../../../network/ergo/api/operations/history/v2/types/RemoveLiquidityOperation';
import { PairAssetBox } from '../../common/PairAssetBox/PairAssetBox';
import { SingleAssetBox } from '../../common/SingleAssetBox/SingleAssetBox';
import { OperationDetailsContainer } from '../common/OperationDetailsContainer/OperationDetailsContainer';
import { TransactionDetails } from '../common/TransactionDetails/TransactionDetails';
import { TransactionPending } from '../common/TransactionPending/TransactionPending';
import { TransactionRefund } from '../common/TransactionRefund/TransactionRefund';

export interface RemoveLiquidityOperationDetailsProps {
  readonly removeLiquidityItem: RemoveLiquidityItem;
}

export const RemoveLiquidityOperationDetails: FC<RemoveLiquidityOperationDetailsProps> =
  ({ removeLiquidityItem }) => (
    <OperationDetailsContainer
      leftSide={
        <TransactionDetails
          title={t`Sent`}
          dateTime={removeLiquidityItem.registerTx.dateTime}
          transactionId={removeLiquidityItem.registerTx.id}
          content={
            <PairAssetBox
              pair={removeLiquidityItem.pool.shares(removeLiquidityItem.lp)}
            />
          }
        />
      }
      rightSide={
        <>
          {removeLiquidityItem.status === OperationStatus.Evaluated && (
            <TransactionDetails
              title={t`Received`}
              dateTime={removeLiquidityItem.evaluateTx.dateTime}
              transactionId={removeLiquidityItem.evaluateTx.id}
              content={
                <Flex col width={200}>
                  <Flex.Item marginBottom={0.5}>
                    <SingleAssetBox currency={removeLiquidityItem.x} />
                  </Flex.Item>
                  <Flex.Item>
                    <SingleAssetBox currency={removeLiquidityItem.y} />
                  </Flex.Item>
                </Flex>
              }
            />
          )}
          {removeLiquidityItem.status === OperationStatus.Pending && (
            <TransactionPending title={t`Received`} />
          )}
          {removeLiquidityItem.status === OperationStatus.Refunded && (
            <TransactionDetails
              title={t`Received`}
              dateTime={removeLiquidityItem.refundTx.dateTime}
              transactionId={removeLiquidityItem.refundTx.id}
              content={
                <PairAssetBox
                  pair={removeLiquidityItem.pool.shares(removeLiquidityItem.lp)}
                />
              }
            />
          )}
          {removeLiquidityItem.status === OperationStatus.NeedRefund && (
            <TransactionRefund
              pair={removeLiquidityItem.pool.shares(removeLiquidityItem.lp)}
              transactionId={removeLiquidityItem.registerTx.id}
            />
          )}
        </>
      }
    />
  );
