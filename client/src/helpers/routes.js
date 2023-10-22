import CreatePage from "../pages/CreatePage";
import SelectPage from "../pages/SelectPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import MenuPage from "../pages/MenuPage";
import GamePage from "../pages/GamePage";

export const routes = [
  {
    path: '/',
    content: <MenuPage />
  },
  {
    path: '/puzzle/:id',
    content: <GamePage />
  },
  {
    path: '/select',
    content: <SelectPage />
  },
  {
    path: '/create',
    content: <CreatePage />
  },
  {
    path: '/leaderboard',
    content: <LeaderboardPage />
  },
]