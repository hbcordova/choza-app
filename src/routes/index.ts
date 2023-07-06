import { RouteRecordRaw, createRouter, createWebHistory} from 'vue-router';
import { useAuthStore } from '../stores/auth';
import HomeComponent from '../components/HomeComponent.vue';
import PropertyListComponent from '../components/PropertyListComponent.vue';
import EntityListComponent from '../components/EntityListComponent.vue';
import ApplicationListComponent from '../components/ApplicationListComponent.vue';
import SecurityView from '../components/SecurityView.vue';
import PropertyDetailComponent from '../components/PropertyDetailComponent.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Security',
        meta: { requiresAuth: false },
        component: () => SecurityView
    },
    {
        path: '/home',
        name: 'Home',
        component: () => HomeComponent,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Properties',
                component: PropertyListComponent
            },
            {
                path: 'properties/:id',
                name: 'PropertyDetail',
                component: PropertyDetailComponent
            },
            {
                path: 'entities',
                name: 'Entities',
                component: EntityListComponent
            },
            {
                path: 'applications',
                name: "Applications",
                component: ApplicationListComponent
            }
        ]
    },
    {
        path: '/customer',
        name: '/customer',
        component: HomeComponent,
        meta: { requiresAuth: true },
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, _, next) => {
    let auth = useAuthStore();
    
    if (to.meta.requiresAuth && !auth.isLogged()) {
        next('/');
    } else {
        next();
    }
})

export default router;