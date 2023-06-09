import { Flex, Tabs, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { fireAnalyticsEvent, user } from '@spectrumlabs/analytics';
import { FC, useCallback } from 'react';

import { useApplicationSettings } from '../../context';

export const ThemeSwitch: FC = () => {
  const [settings, setSettings] = useApplicationSettings();
  const { theme } = settings;

  const handleChangeTheme = useCallback(
    (key: 'dark' | 'light' | 'system') => {
      user.set('theme_active', key);
      setSettings({
        ...settings,
        theme: key,
      });
      fireAnalyticsEvent('Select Theme', { theme: key });
      user.set('theme_active', key);
    },
    [settings, setSettings],
  );

  return (
    <Flex col>
      <Flex.Item marginBottom={1}>
        <Typography.Body size="small">
          <Trans>Theme</Trans>
        </Typography.Body>
      </Flex.Item>
      <Tabs
        size="small"
        fullWidth
        onChange={handleChangeTheme as any}
        activeKey={theme || 'light'}
      >
        <Tabs.TabPane tab={t`Light`} key="light" />
        <Tabs.TabPane tab={t`Dark`} key="dark" />
        <Tabs.TabPane tab={t`System`} key="system" />
      </Tabs>
    </Flex>
  );
};
