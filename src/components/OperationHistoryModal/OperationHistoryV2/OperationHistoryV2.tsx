import { Flex, ModalRef, useDevice } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC, useEffect, useState } from 'react';

import { useSubject } from '../../../common/hooks/useObservable';
import { getOperations } from '../../../network/ergo/api/operations/history/v2/operationsHistory';
import { OperationItem } from '../../../network/ergo/api/operations/history/v2/types/OperationItem';
import { TableView } from '../../TableView/TableView';
import { LoadingState } from '../OperationHistoryV1/OperationHistoryTable/states/LoadingState/LoadingState';
import { OperationSearchEmptyState } from '../OperationHistoryV1/OperationHistoryTable/states/OperationSearchEmptyState/OperationSearchEmptyState';
import { OperationsEmptyState } from '../OperationHistoryV1/OperationHistoryTable/states/OperationsEmptyState/OperationsEmptyState';
import { AssetsCell } from './cells/AssetsCell/AssetsCell';
import { DateTimeCell } from './cells/DateTimeCell/DateTimeCell';
import { FeeCell } from './cells/FeeCell/FeeCell';
import { StatusCell } from './cells/StatusCell/StatusCell';
import { TypeCell } from './cells/TypeCell/TypeCell';
import { OperationDetails } from './OperationDetails/OperationDetails';
import { OperationPagination } from './OperationPagination/OperationPagination';
import { ErrorState } from './states/ErrorState/ErrorState';

const LIMIT = 25;

export const OperationHistoryV2: FC<ModalRef> = ({ close }) => {
  const { moreThan } = useDevice();
  const [offset, setOffset] = useState<number>(0);

  const [operationsData, loadOperations, loading, error] =
    useSubject(getOperations);

  useEffect(() => {
    loadOperations(LIMIT, offset);
  }, [offset]);

  const reloadOperations = () => loadOperations(LIMIT, offset);

  return (
    <Flex col>
      <TableView
        itemHeight={80}
        items={operationsData?.[0] || []}
        maxHeight={464}
        tableHeaderPadding={[0, 6]}
        tableItemViewPadding={[0, 4, 0, 2]}
        gap={1}
        itemKey="id"
        emptyFilterView={<OperationSearchEmptyState />}
        expandPadding={[0, 0]}
        expand={{
          accordion: true,
          component: OperationDetails,
          height: 132,
        }}
      >
        <TableView.Column title={t`Assets`} width={218} headerWidth={202}>
          {(operationItem: OperationItem) => (
            <AssetsCell operationItem={operationItem} />
          )}
        </TableView.Column>
        <TableView.Column title="Type" width={120} show={moreThan('m')}>
          {(operationItem: OperationItem) => (
            <TypeCell operationItem={operationItem} />
          )}
        </TableView.Column>
        <TableView.Column title="Fee" width={90} show={moreThan('m')}>
          {(operationItem: OperationItem) => (
            <FeeCell operationItem={operationItem} />
          )}
        </TableView.Column>
        <TableView.Column
          title={t`Date & Time`}
          width={110}
          show={moreThan('m')}
        >
          {(operationItem: OperationItem) => (
            <DateTimeCell operationItem={operationItem} />
          )}
        </TableView.Column>
        <TableView.Column title={t`Status`}>
          {(operationItem: OperationItem) => (
            <StatusCell operationItem={operationItem} />
          )}
        </TableView.Column>

        <TableView.State condition={loading} name="loading">
          <LoadingState height={420} />
        </TableView.State>
        <TableView.State
          condition={!loading && !error && !operationsData?.[1]}
          name="empty"
        >
          <OperationsEmptyState onSwapNowButtonClick={close} height={420} />
        </TableView.State>
        <TableView.State condition={!loading && !!error} name="error">
          <ErrorState onReloadClick={reloadOperations} />
        </TableView.State>
      </TableView>
      {operationsData?.[1] ? (
        <Flex.Item marginTop={4}>
          <OperationPagination
            onOffsetChange={setOffset}
            limit={LIMIT}
            offset={offset}
            total={operationsData?.[1] || 0}
          />
        </Flex.Item>
      ) : (
        ''
      )}
    </Flex>
  );
};
