import { AppShell, useMantineTheme } from '@mantine/core';
import { lazy } from 'react';

import Card from '../components/Card';
import QuestionCounter from '../components/dashboard/QuestionCounter';
import './Dashboard.css';

const Header = lazy(() => import('../components/Header'));

function Dashboard() {
  const theme = useMantineTheme();
  return (
    <AppShell withBorder={false} header={{ height: 80 }}>
      <Header />
      <AppShell.Main h="calc(100vh - 80px)" w="100%" bg="slate.9">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <Card className="dashboard-stats">
              <div className="dashboard-stats-difficulty">
                <QuestionCounter colour={theme.colors.green[4]} label="Easy" />
                <QuestionCounter
                  colour={theme.colors.orange[4]}
                  label="Medium"
                />
                <QuestionCounter colour={theme.colors.red[4]} label="Hard" />
              </div>
              <div className="dashboard-stats-topic">
                <h2 className="dashboard-stats-topic-label">
                  Favourite Topics
                </h2>
                <table className="dashboard-stats-topic-table">
                  <tbody>
                    <tr>
                      <td className="topic-label-container">
                        <span
                          className="topic-label"
                          style={{ backgroundColor: theme.colors.slate[7] }}
                        >
                          Arrays
                        </span>
                      </td>
                      <td>
                        <span className="topic-number-solved">12</span> Problems
                        Solved
                      </td>
                    </tr>
                    <tr>
                      <td className="topic-label-container">
                        <span
                          className="topic-label"
                          style={{ backgroundColor: theme.colors.slate[7] }}
                        >
                          Dynamic Programming
                        </span>
                      </td>
                      <td>
                        <span className="topic-number-solved">12</span> Problems
                        Solved
                      </td>
                    </tr>
                    <tr>
                      <td className="topic-label-container">
                        <span
                          className="topic-label"
                          style={{ backgroundColor: theme.colors.slate[7] }}
                        >
                          Hash Table
                        </span>
                      </td>
                      <td>
                        <span className="topic-number-solved">12</span> Problems
                        Solved
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
            <Card className="dashboard-practice">
              <h2 className="dashboard-practice-label">Practice</h2>
              <button
                className="dashboard-practice-button"
                style={{ backgroundColor: theme.colors.slate[7] }}
              >
                Start Interview
              </button>
              <p className="dashboard-practice-help">
                Not sure how this works?
              </p>
            </Card>
          </div>
          <Card className="practice-history-container">
            <h2 className="practice-history-label">Practice History</h2>
            <table className="dashboard-table">
              <thead style={{ backgroundColor: theme.colors.slate[7] }}>
                <tr>
                  <th className="expand">Question</th>
                  <th>Date</th>
                  <th>Difficulty</th>
                  <th>Language</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Diameter of Binary Tree</td>
                  <td>Sep 23, 2023</td>
                  <td>Medium</td>
                  <td>Python 3</td>
                  <td>
                    <button
                      className="view-button"
                      style={{ backgroundColor: theme.colors.slate[7] }}
                    >
                      View
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Diameter of Binary Tree</td>
                  <td>Sep 23, 2023</td>
                  <td>Medium</td>
                  <td>Python 3</td>
                  <td>
                    <button
                      className="view-button"
                      style={{ backgroundColor: theme.colors.slate[7] }}
                    >
                      View
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Diameter of Binary Tree</td>
                  <td>Sep 23, 2023</td>
                  <td>Medium</td>
                  <td>Python 3</td>
                  <td>
                    <button
                      className="view-button"
                      style={{ backgroundColor: theme.colors.slate[7] }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

export default Dashboard;
