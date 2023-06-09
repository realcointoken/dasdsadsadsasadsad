import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import { first } from 'rxjs';

import { Currency } from '../../../../../../common/models/Currency';
import { TxId } from '../../../../../../common/types';
import { refund } from '../../../../../../gateway/api/operations/refund';

export interface TransactionRefundProps {
  readonly transactionId: TxId;
  readonly pair: [Currency, Currency];
}

export const TransactionRefund: FC<TransactionRefundProps> = ({
  transactionId,
  pair,
}) => {
  const handleRefundButtonClick = () => {
    refund(transactionId, pair[0], pair[1]).pipe(first()).subscribe();
  };

  return (
    <Flex col align="center">
      <Flex.Item marginBottom={2}>
        <Typography.Body size="small" secondary align="center">
          <Trans>
            The price has changed while your order was being processed. So we
            didn’t execute it to prevent losses. Click the button to get your
            funds back.
          </Trans>
        </Typography.Body>
      </Flex.Item>
      <Button
        width={197}
        type="primary"
        htmlType="button"
        size="middle"
        onClick={handleRefundButtonClick}
      >
        <Trans>Refund</Trans>
      </Button>
    </Flex>
  );
};
