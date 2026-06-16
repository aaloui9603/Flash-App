import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LibraryView from '../views/LibraryView.vue'
import StatisticsView from '../views/StatisticsView.vue'
import NotesView from '../views/NotesView.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/library',
        name: 'Library',
        component: LibraryView
    },
    {
        path: '/statistics',
        name: 'Statistics',
        component: StatisticsView
    },
    {
        path: '/notes',
        name: 'Notes',
        component: NotesView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router