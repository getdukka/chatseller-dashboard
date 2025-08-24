import { u as useAuthStore } from './auth-KgQDcdck.mjs';
import { computed } from 'vue';
import { n as navigateTo } from './server.mjs';

const useAuth = () => {
  const authStore = useAuthStore();
  const user = computed(() => authStore.user);
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const isLoggedIn = computed(() => authStore.isLoggedIn);
  const loading = computed(() => authStore.loading);
  const token = computed(() => authStore.token);
  const userShopId = computed(() => authStore.userShopId);
  const userEmail = computed(() => authStore.userEmail);
  const userName = computed(() => authStore.userName);
  const userInitials = computed(() => authStore.userInitials);
  const planDetails = computed(() => authStore.planDetails);
  const currentPlan = computed(() => authStore.currentPlan);
  const isPaidUser = computed(() => authStore.isPaidUser);
  const hasActiveAccess = computed(() => authStore.hasActiveAccess);
  const trialExpired = computed(() => authStore.trialExpired);
  const login = async (credentials) => {
    const result = await authStore.login(credentials);
    if (result.success) {
      await navigateTo("/");
    }
    return result;
  };
  const register = async (data) => {
    const storeData = {
      email: data.email,
      password: data.password,
      name: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company,
      platform: data.platform,
      newsletter: data.newsletter
    };
    const result = await authStore.register(storeData);
    return result;
  };
  const logout = async () => {
    await authStore.logout();
    await navigateTo("/login");
  };
  const resetPassword = async (email) => {
    return await authStore.resetPassword(email);
  };
  const updateProfile = async (data) => {
    return await authStore.updateProfile(data);
  };
  const restoreSession = async () => {
    return await authStore.restoreSession();
  };
  const refreshToken = async () => {
    const result = await authStore.refreshToken();
    if (!result.success) {
      await navigateTo("/login");
    }
    return result;
  };
  const fetchCompleteUserData = async (authUser) => {
    return await authStore.fetchCompleteUserDataViaAPI(authUser, authStore.token || "");
  };
  const requireAuth = async () => {
    if (!authStore.isLoggedIn) {
      await navigateTo("/login");
      return false;
    }
    return true;
  };
  const requireGuest = async () => {
    if (authStore.isLoggedIn) {
      await navigateTo("/");
      return false;
    }
    return true;
  };
  const hasPermission = (permission) => {
    return true;
  };
  const getInitials = (name) => {
    if (name) {
      return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return authStore.userInitials || "U";
  };
  const needsOnboarding = () => {
    var _a;
    if (!((_a = authStore.user) == null ? void 0 : _a.shop)) return true;
    const shop = authStore.user.shop;
    return !shop.onboarding_completed;
  };
  const checkOnboardingStatus = async () => {
    if (!authStore.isAuthenticated) {
      return { needsOnboarding: false, redirectTo: "/login" };
    }
    if (needsOnboarding()) {
      return { needsOnboarding: true, redirectTo: "/onboarding" };
    }
    return { needsOnboarding: false };
  };
  return {
    // State - Accès aux getters Pinia via computed
    user,
    isAuthenticated,
    isLoggedIn,
    loading,
    token,
    userShopId,
    userEmail,
    userName,
    userInitials,
    planDetails,
    currentPlan,
    isPaidUser,
    hasActiveAccess,
    trialExpired,
    // Actions
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    restoreSession,
    refreshToken,
    fetchCompleteUserData,
    // Utilities
    requireAuth,
    requireGuest,
    hasPermission,
    getInitials,
    needsOnboarding,
    checkOnboardingStatus
  };
};

export { useAuth as u };
//# sourceMappingURL=useAuth-CAs-0VL3.mjs.map
