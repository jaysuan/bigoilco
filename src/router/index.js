import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import { auth } from "../firebase";

Vue.use(VueRouter);

const routes = [
    {
        path: "/login",
        name: "Login",
        component: () =>
            import(/* webpackChunkName: "login" */ "../views/Login.vue"),
        meta: {
            isPublic: true
        }
    },

    {
        path: "/page-not-found",
        name: "PageNotFound",
        component: () =>
            import(/* webpackChunkName: "login" */ "../views/PageNotFound.vue")
    },

    {
        path: "/",
        name: "Home",
        component: () =>
            import(/* webpackChunkName: "home" */ "../views/Dashboard.vue"),
        children: [
            {
                path: "/about",
                name: "About",
                component: () =>
                    import(
                        /* webpackChunkName: "about" */ "../views/About.vue"
                    ),
                meta: {
                    isPublic: true
                }
            },
            {
                path: "/intake",
                name: "Intake",
                component: () =>
                    import(
                        /* webpackChunkName: "intake" */ "../views/Intake.vue"
                    ),
                meta: {
                    requiredRole: "Salesman"
                }
            },
            {
                path: "/dispatch",
                name: "Dispatch",
                component: () =>
                    import(
                        /* webpackChunkName: "dispatch" */ "../views/IntakeDispatch.vue"
                    ),
                meta: {
                    requiredRole: "Employee"
                }
            },
            {
                path: "/intake-manager/:id?",
                name: "IntakeManager",
                component: () =>
                    import(
                        /* webpackChunkName: "intake-manager" */ "../views/IntakeManager.vue"
                    ),
                meta: {
                    requiredRole: "Employee"
                }
            },
            {
                path: "/admin",
                name: "Admin",
                component: () =>
                    import(
                        /* webpackChunkName: "admin" */ "../views/Admin.vue"
                    ),
                meta: {
                    requiredRole: "Admin"
                }
            },
            {
                path: "/work-orders",
                name: "WorkOrders",
                component: () =>
                    import(
                        /* webpackChunkName: "work-orders" */ "../views/WorkOrders.vue"
                    )
            },
            {
                path: "/clients",
                name: "Clients",
                component: () => import("@/views/Clients.vue"),
                meta: {
                    requiredRole: "Salesman"
                }
            },
            {
                path: "/public/client-onboarding",
                name: "Public Client Onboarding",
                component: () => import("@/views/ClientOnboarding.vue"),
                meta: {
                    isPublic: true
                }
            }
        ]
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

const getCurrentUser = () =>
    new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            if (user) {
                console.info("A user logged in");
                const idTokenResult = await user.getIdTokenResult();
                const role = idTokenResult.claims.role;
                const currentUser = {
                    email: user.email,
                    name: user.displayName,
                    role
                };
                store.commit("setCurrentUser", currentUser);
                unsubscribe();
                resolve(currentUser);
            } else {
                console.info("A user logged out");
                store.commit("setCurrentUser", null);
                resolve(null);
            }
        }, reject);
    });

router.beforeEach(async (to, from, next) => {
    const isPublic = to.meta.isPublic;
    const requiredRole = to.meta.requiredRole;

    try {
        const currentUser = await getCurrentUser();
        if (!isPublic && !currentUser) {
            next("/login");
        } else if (
            requiredRole &&
            currentUser.role !== requiredRole &&
            currentUser.role !== "Admin"
        ) {
            console.info(`Current user role: ${currentUser.role}`);
            console.error(`${to.name} page requires '${requiredRole}' role`);
            console.error("Insufficient permission to access this page");
            next("/page-not-found");
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
    }
});

export default router;
