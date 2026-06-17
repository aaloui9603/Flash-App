import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LibraryView from '../views/LibraryView.vue'
import StatisticsView from '../views/StatisticsView.vue'
import NotesView from '../views/NotesView.vue'
import LearnView from '../views/LearnView.vue'
import QuestionView from '../views/QuestionView.vue'

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
    },
    {
        path: '/learn',
        name: 'Learn',
        component: LearnView
    },
    {
        path: '/questions',
        name: 'Questions',
        component: QuestionView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router