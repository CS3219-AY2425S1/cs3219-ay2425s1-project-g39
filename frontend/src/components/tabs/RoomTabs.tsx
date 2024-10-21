import { Tabs } from '@mantine/core';
import '@mantine/core/styles.css';

import DescriptionTab from './DescriptionTab';

function RoomTabs() {
  return (
    <Tabs
      defaultValue="description"
      h="calc(100% - 160px)"
      bg="slate.9"
      p="10px"
      style={{ borderRadius: '4px' }}
    >
      <Tabs.List>
        <Tabs.Tab value="description">Description</Tabs.Tab>
        {/* <Tabs.Tab value="notes">Notes</Tabs.Tab>
        <Tabs.Tab value="output">Output</Tabs.Tab> */}
      </Tabs.List>

      <Tabs.Panel value="description" h="calc(100% - 36px)">
        <DescriptionTab
          title="Two Sum"
          difficulty="Easy"
          topics={['Array']}
          description="Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.<br /><br />

          You may assume that each input would have <b>exactly one solution</b>, and you may not use the <i>same</i> element twice.<br /><br />
          
          You can return the answer in any order.<br /><br />

          <b>Example 1:</b><br />

          Input: <code>nums = [2,7,11,15], target = 0</code><br />
          Output: <code>[0,1]</code><br />
          Explanation: Because <code>nums[0] + nums[1] == 9</code>, we return <code>[0,1]</code>.<br /><br />

          <b>Example 2:</b><br />

          Input: <code>nums = [3,2,4], target = 6</code><br />
          Output: <code>[1,2]</code><br /><br />
          
          <b>Constraints:</b>
          <ul>
            <li><code>2 <= nums.length <= 10^4</code></li>
            <li><code>-10^9 <= nums[i] <= 10^9</code></li>
            <li><code>-10^9 <= target <= 10^9</code></li>
            <li><b>Only one valid answer exists.</b></li>
          </ul>
          "
        />
      </Tabs.Panel>
      {/* <Tabs.Panel value="notes" h="calc(100% - 36px)">
        <Container p="16px">Notes</Container>
      </Tabs.Panel>
      <Tabs.Panel value="output" h="calc(100% - 36px)">
        <Container p="16px">Output</Container>
      </Tabs.Panel> */}
    </Tabs>
  );
}

export default RoomTabs;
