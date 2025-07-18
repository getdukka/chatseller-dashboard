import { ref, computed, readonly } from 'vue';
import { FunctionsClient } from '@supabase/functions-js';
import { PostgrestClient } from '@supabase/postgrest-js';
import { RealtimeClient } from '@supabase/realtime-js';
import { StorageClient } from '@supabase/storage-js';
import nodeFetch, { Headers as Headers$1 } from '@supabase/node-fetch';
import { AuthClient } from '@supabase/auth-js';
import { b as useRuntimeConfig } from './server.mjs';

const version = "2.52.0";
let JS_ENV = "";
if (typeof Deno !== "undefined") {
  JS_ENV = "deno";
} else {
  JS_ENV = "node";
}
const DEFAULT_HEADERS = { "X-Client-Info": `supabase-js-${JS_ENV}/${version}` };
const DEFAULT_GLOBAL_OPTIONS = {
  headers: DEFAULT_HEADERS
};
const DEFAULT_DB_OPTIONS = {
  schema: "public"
};
const DEFAULT_AUTH_OPTIONS = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  flowType: "implicit"
};
const DEFAULT_REALTIME_OPTIONS = {};
var __awaiter$2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, [])).next());
  });
};
const resolveFetch = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = nodeFetch;
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
const resolveHeadersConstructor = () => {
  if (typeof Headers === "undefined") {
    return Headers$1;
  }
  return Headers;
};
const fetchWithAuth = (supabaseKey, getAccessToken, customFetch) => {
  const fetch2 = resolveFetch(customFetch);
  const HeadersConstructor = resolveHeadersConstructor();
  return (input, init) => __awaiter$2(void 0, void 0, void 0, function* () {
    var _a;
    const accessToken = (_a = yield getAccessToken()) !== null && _a !== void 0 ? _a : supabaseKey;
    let headers = new HeadersConstructor(init === null || init === void 0 ? void 0 : init.headers);
    if (!headers.has("apikey")) {
      headers.set("apikey", supabaseKey);
    }
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return fetch2(input, Object.assign(Object.assign({}, init), { headers }));
  });
};
var __awaiter$1 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, [])).next());
  });
};
function ensureTrailingSlash(url) {
  return url.endsWith("/") ? url : url + "/";
}
function applySettingDefaults(options, defaults) {
  var _a, _b;
  const { db: dbOptions, auth: authOptions, realtime: realtimeOptions, global: globalOptions } = options;
  const { db: DEFAULT_DB_OPTIONS2, auth: DEFAULT_AUTH_OPTIONS2, realtime: DEFAULT_REALTIME_OPTIONS2, global: DEFAULT_GLOBAL_OPTIONS2 } = defaults;
  const result = {
    db: Object.assign(Object.assign({}, DEFAULT_DB_OPTIONS2), dbOptions),
    auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS2), authOptions),
    realtime: Object.assign(Object.assign({}, DEFAULT_REALTIME_OPTIONS2), realtimeOptions),
    global: Object.assign(Object.assign(Object.assign({}, DEFAULT_GLOBAL_OPTIONS2), globalOptions), { headers: Object.assign(Object.assign({}, (_a = DEFAULT_GLOBAL_OPTIONS2 === null || DEFAULT_GLOBAL_OPTIONS2 === void 0 ? void 0 : DEFAULT_GLOBAL_OPTIONS2.headers) !== null && _a !== void 0 ? _a : {}), (_b = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.headers) !== null && _b !== void 0 ? _b : {}) }),
    accessToken: () => __awaiter$1(this, void 0, void 0, function* () {
      return "";
    })
  };
  if (options.accessToken) {
    result.accessToken = options.accessToken;
  } else {
    delete result.accessToken;
  }
  return result;
}
class SupabaseAuthClient extends AuthClient {
  constructor(options) {
    super(options);
  }
}
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, [])).next());
  });
};
class SupabaseClient {
  /**
   * Create a new client for use in the browser.
   * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
   * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
   * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
   * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
   * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
   * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
   * @param options.realtime Options passed along to realtime-js constructor.
   * @param options.global.fetch A custom fetch implementation.
   * @param options.global.headers Any additional headers to send with each network request.
   */
  constructor(supabaseUrl, supabaseKey, options) {
    var _a, _b, _c;
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    if (!supabaseUrl)
      throw new Error("supabaseUrl is required.");
    if (!supabaseKey)
      throw new Error("supabaseKey is required.");
    const _supabaseUrl = ensureTrailingSlash(supabaseUrl);
    const baseUrl = new URL(_supabaseUrl);
    this.realtimeUrl = new URL("realtime/v1", baseUrl);
    this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws");
    this.authUrl = new URL("auth/v1", baseUrl);
    this.storageUrl = new URL("storage/v1", baseUrl);
    this.functionsUrl = new URL("functions/v1", baseUrl);
    const defaultStorageKey = `sb-${baseUrl.hostname.split(".")[0]}-auth-token`;
    const DEFAULTS = {
      db: DEFAULT_DB_OPTIONS,
      realtime: DEFAULT_REALTIME_OPTIONS,
      auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS), { storageKey: defaultStorageKey }),
      global: DEFAULT_GLOBAL_OPTIONS
    };
    const settings = applySettingDefaults(options !== null && options !== void 0 ? options : {}, DEFAULTS);
    this.storageKey = (_a = settings.auth.storageKey) !== null && _a !== void 0 ? _a : "";
    this.headers = (_b = settings.global.headers) !== null && _b !== void 0 ? _b : {};
    if (!settings.accessToken) {
      this.auth = this._initSupabaseAuthClient((_c = settings.auth) !== null && _c !== void 0 ? _c : {}, this.headers, settings.global.fetch);
    } else {
      this.accessToken = settings.accessToken;
      this.auth = new Proxy({}, {
        get: (_, prop) => {
          throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(prop)} is not possible`);
        }
      });
    }
    this.fetch = fetchWithAuth(supabaseKey, this._getAccessToken.bind(this), settings.global.fetch);
    this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers, accessToken: this._getAccessToken.bind(this) }, settings.realtime));
    this.rest = new PostgrestClient(new URL("rest/v1", baseUrl).href, {
      headers: this.headers,
      schema: settings.db.schema,
      fetch: this.fetch
    });
    if (!settings.accessToken) {
      this._listenForAuthEvents();
    }
  }
  /**
   * Supabase Functions allows you to deploy and invoke edge functions.
   */
  get functions() {
    return new FunctionsClient(this.functionsUrl.href, {
      headers: this.headers,
      customFetch: this.fetch
    });
  }
  /**
   * Supabase Storage allows you to manage user-generated content, such as photos or videos.
   */
  get storage() {
    return new StorageClient(this.storageUrl.href, this.headers, this.fetch);
  }
  /**
   * Perform a query on a table or a view.
   *
   * @param relation - The table or view name to query
   */
  from(relation) {
    return this.rest.from(relation);
  }
  // NOTE: signatures must be kept in sync with PostgrestClient.schema
  /**
   * Select a schema to query or perform an function (rpc) call.
   *
   * The schema needs to be on the list of exposed schemas inside Supabase.
   *
   * @param schema - The schema to query
   */
  schema(schema) {
    return this.rest.schema(schema);
  }
  // NOTE: signatures must be kept in sync with PostgrestClient.rpc
  /**
   * Perform a function call.
   *
   * @param fn - The function name to call
   * @param args - The arguments to pass to the function call
   * @param options - Named parameters
   * @param options.head - When set to `true`, `data` will not be returned.
   * Useful if you only need the count.
   * @param options.get - When set to `true`, the function will be called with
   * read-only access mode.
   * @param options.count - Count algorithm to use to count rows returned by the
   * function. Only applicable for [set-returning
   * functions](https://www.postgresql.org/docs/current/functions-srf.html).
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  rpc(fn, args = {}, options = {}) {
    return this.rest.rpc(fn, args, options);
  }
  /**
   * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
   *
   * @param {string} name - The name of the Realtime channel.
   * @param {Object} opts - The options to pass to the Realtime channel.
   *
   */
  channel(name, opts = { config: {} }) {
    return this.realtime.channel(name, opts);
  }
  /**
   * Returns all Realtime channels.
   */
  getChannels() {
    return this.realtime.getChannels();
  }
  /**
   * Unsubscribes and removes Realtime channel from Realtime client.
   *
   * @param {RealtimeChannel} channel - The name of the Realtime channel.
   *
   */
  removeChannel(channel) {
    return this.realtime.removeChannel(channel);
  }
  /**
   * Unsubscribes and removes all Realtime channels from Realtime client.
   */
  removeAllChannels() {
    return this.realtime.removeAllChannels();
  }
  _getAccessToken() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      if (this.accessToken) {
        return yield this.accessToken();
      }
      const { data } = yield this.auth.getSession();
      return (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : null;
    });
  }
  _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, storage, storageKey, flowType, lock, debug }, headers, fetch2) {
    const authHeaders = {
      Authorization: `Bearer ${this.supabaseKey}`,
      apikey: `${this.supabaseKey}`
    };
    return new SupabaseAuthClient({
      url: this.authUrl.href,
      headers: Object.assign(Object.assign({}, authHeaders), headers),
      storageKey,
      autoRefreshToken,
      persistSession,
      detectSessionInUrl,
      storage,
      flowType,
      lock,
      debug,
      fetch: fetch2,
      // auth checks if there is a custom authorizaiton header using this flag
      // so it knows whether to return an error when getUser is called with no session
      hasCustomAuthorizationHeader: "Authorization" in this.headers
    });
  }
  _initRealtimeClient(options) {
    return new RealtimeClient(this.realtimeUrl.href, Object.assign(Object.assign({}, options), { params: Object.assign({ apikey: this.supabaseKey }, options === null || options === void 0 ? void 0 : options.params) }));
  }
  _listenForAuthEvents() {
    let data = this.auth.onAuthStateChange((event, session) => {
      this._handleTokenChanged(event, "CLIENT", session === null || session === void 0 ? void 0 : session.access_token);
    });
    return data;
  }
  _handleTokenChanged(event, source, token) {
    if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && this.changedAccessToken !== token) {
      this.changedAccessToken = token;
    } else if (event === "SIGNED_OUT") {
      this.realtime.setAuth();
      if (source == "STORAGE")
        this.auth.signOut();
      this.changedAccessToken = void 0;
    }
  }
}
const createClient = (supabaseUrl, supabaseKey, options) => {
  return new SupabaseClient(supabaseUrl, supabaseKey, options);
};
const useAuth = () => {
  const config = useRuntimeConfig();
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  );
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const initialized = ref(false);
  const isAuthenticated = computed(() => !!user.value);
  const isLoggedIn = computed(() => !!user.value);
  const isLoading = computed(() => loading.value);
  const userProfile = computed(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (!user.value) return null;
    return {
      id: user.value.id,
      email: user.value.email,
      fullName: ((_a = user.value.user_metadata) == null ? void 0 : _a.full_name) || `${(_b = user.value.user_metadata) == null ? void 0 : _b.first_name} ${(_c = user.value.user_metadata) == null ? void 0 : _c.last_name}`,
      firstName: (_d = user.value.user_metadata) == null ? void 0 : _d.first_name,
      lastName: (_e = user.value.user_metadata) == null ? void 0 : _e.last_name,
      businessName: (_f = user.value.user_metadata) == null ? void 0 : _f.business_name,
      phone: (_g = user.value.user_metadata) == null ? void 0 : _g.phone,
      avatarUrl: (_h = user.value.user_metadata) == null ? void 0 : _h.avatar_url,
      createdAt: user.value.created_at
    };
  });
  const initializeAuth = async () => {
    try {
      loading.value = true;
      const { data: { session } } = await supabase.auth.getSession();
      if (session == null ? void 0 : session.user) {
        user.value = session.user;
      }
      supabase.auth.onAuthStateChange((event, session2) => {
        user.value = (session2 == null ? void 0 : session2.user) || null;
      });
      initialized.value = true;
    } catch (error2) {
      console.error("Erreur initialisation auth:", error2);
      initialized.value = true;
    } finally {
      loading.value = false;
    }
  };
  const initialize = initializeAuth;
  const signIn = async (email, password) => {
    var _a, _b, _c, _d;
    loading.value = true;
    error.value = null;
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });
      if (authError) {
        return {
          data: null,
          error: authError
        };
      }
      if (!data.user) {
        return {
          data: null,
          error: { message: "Aucun utilisateur retourn\xE9 apr\xE8s connexion" }
        };
      }
      user.value = data.user;
      const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
      if (profileError && profileError.code !== "PGRST116") {
        console.error("Erreur lors de la r\xE9cup\xE9ration du profil:", profileError);
      }
      if (!profile) {
        const { error: createProfileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email,
          first_name: (_a = data.user.user_metadata) == null ? void 0 : _a.first_name,
          last_name: (_b = data.user.user_metadata) == null ? void 0 : _b.last_name,
          business_name: (_c = data.user.user_metadata) == null ? void 0 : _c.business_name,
          phone: (_d = data.user.user_metadata) == null ? void 0 : _d.phone,
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        if (createProfileError) {
          console.error("Erreur lors de la cr\xE9ation du profil:", createProfileError);
        }
      }
      return {
        data,
        error: null
      };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      error.value = errorMessage;
      console.error("Erreur de connexion:", err);
      return {
        data: null,
        error: { message: errorMessage }
      };
    } finally {
      loading.value = false;
    }
  };
  const signUp = async (email, password, metadata) => {
    var _a;
    loading.value = true;
    error.value = null;
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            first_name: metadata.firstName.trim(),
            last_name: metadata.lastName.trim(),
            business_name: metadata.company.trim(),
            website: (_a = metadata.website) == null ? void 0 : _a.trim(),
            full_name: `${metadata.firstName.trim()} ${metadata.lastName.trim()}`
          }
        }
      });
      if (authError) {
        return {
          data: null,
          error: authError
        };
      }
      if (!data.user) {
        return {
          data: null,
          error: { message: "Erreur lors de la cr\xE9ation du compte" }
        };
      }
      return {
        data,
        error: null
      };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      error.value = errorMessage;
      console.error("Erreur d'inscription:", err);
      return {
        data: null,
        error: { message: errorMessage }
      };
    } finally {
      loading.value = false;
    }
  };
  const signOut = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw signOutError;
      }
      user.value = null;
      if (false) ;
      return { success: true };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      error.value = errorMessage;
      console.error("Erreur de d\xE9connexion:", err);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      loading.value = false;
    }
  };
  const resetPassword = async (email) => {
    loading.value = true;
    error.value = null;
    try {
      const resetUrl = false ? `${(void 0).location.origin}/reset-password` : "http://localhost:3000/reset-password";
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: resetUrl }
      );
      if (resetError) {
        return {
          error: resetError
        };
      }
      return { error: null };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      error.value = errorMessage;
      return {
        error: { message: errorMessage }
      };
    } finally {
      loading.value = false;
    }
  };
  const updateProfile = async (updates) => {
    if (!user.value) {
      throw new Error("Utilisateur non connect\xE9");
    }
    loading.value = true;
    error.value = null;
    try {
      const metadata = {};
      if (updates.firstName) metadata.first_name = updates.firstName.trim();
      if (updates.lastName) metadata.last_name = updates.lastName.trim();
      if (updates.businessName) metadata.business_name = updates.businessName.trim();
      if (updates.phone) metadata.phone = updates.phone.trim();
      if (updates.firstName && updates.lastName) {
        metadata.full_name = `${updates.firstName.trim()} ${updates.lastName.trim()}`;
      }
      const { error: updateError } = await supabase.auth.updateUser({
        data: metadata
      });
      if (updateError) {
        throw updateError;
      }
      const profileUpdates = {
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (updates.firstName) profileUpdates.first_name = updates.firstName.trim();
      if (updates.lastName) profileUpdates.last_name = updates.lastName.trim();
      if (updates.businessName) profileUpdates.business_name = updates.businessName.trim();
      if (updates.phone) profileUpdates.phone = updates.phone.trim();
      const { error: profileError } = await supabase.from("profiles").update(profileUpdates).eq("id", user.value.id);
      if (profileError) {
        console.error("Erreur mise \xE0 jour profil:", profileError);
      }
      return { success: true };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      error.value = errorMessage;
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      loading.value = false;
    }
  };
  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error2) {
      console.error("Erreur v\xE9rification auth:", error2);
      return false;
    }
  };
  const getErrorMessage = (error2) => {
    if (!error2) return "Une erreur inconnue est survenue";
    const errorMessages = {
      "Invalid login credentials": "Email ou mot de passe incorrect",
      "Email not confirmed": "Veuillez confirmer votre email avant de vous connecter",
      "User already exists": "Un compte existe d\xE9j\xE0 avec cet email",
      "User already registered": "Un compte existe d\xE9j\xE0 avec cet email",
      "Password should be at least 6 characters": "Le mot de passe doit contenir au moins 6 caract\xE8res",
      "Signup requires a valid password": "Le mot de passe n'est pas valide",
      "Invalid email": "Format d'email invalide",
      "Signup is disabled": "Les inscriptions sont temporairement d\xE9sactiv\xE9es",
      "Email rate limit exceeded": "Trop de tentatives, veuillez patienter",
      "Too many requests": "Trop de tentatives de connexion. Veuillez r\xE9essayer plus tard",
      "User not found": "Aucun compte trouv\xE9 avec cette adresse email",
      "Invalid credentials": "Identifiants invalides",
      "Authentication failed": "\xC9chec de l'authentification"
    };
    const message = error2.message || error2.toString();
    return errorMessages[message] || `Une erreur est survenue. Veuillez r\xE9essayer`;
  };
  const clearError = () => {
    error.value = null;
  };
  return {
    // État
    user: readonly(user),
    userProfile,
    loading: readonly(loading),
    isLoading,
    // Alias
    error: readonly(error),
    isAuthenticated,
    isLoggedIn,
    // Alias
    initialized: readonly(initialized),
    // Actions
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    checkAuth,
    clearError,
    initialize,
    // Alias pour initializeAuth
    initializeAuth
    // Fonction originale
  };
};

export { useAuth as u };
//# sourceMappingURL=useAuth-CgRQXKMP.mjs.map
