import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isProtectedPathname,
  shouldRunSessionMiddleware,
} from "../src/lib/supabase/middleware-config.ts";

describe("middleware scope", () => {
  it("protege admin, perfil y asistencias", () => {
    assert.equal(isProtectedPathname("/admin"), true);
    assert.equal(isProtectedPathname("/admin/scanner"), true);
    assert.equal(isProtectedPathname("/perfil"), true);
    assert.equal(isProtectedPathname("/perfil/extra"), true);
    assert.equal(isProtectedPathname("/asistencias"), true);
    assert.equal(isProtectedPathname("/asistenci"), false);
    assert.equal(isProtectedPathname("/auth/login"), false);
  });

  it("no corre middleware en rutas públicas", () => {
    assert.equal(shouldRunSessionMiddleware("/"), false);
    assert.equal(shouldRunSessionMiddleware("/eventos"), false);
    assert.equal(shouldRunSessionMiddleware("/trabajar/cafe-x"), false);
    assert.equal(shouldRunSessionMiddleware("/marketplace/startups/foo"), false);
    assert.equal(shouldRunSessionMiddleware("/blog"), false);
    assert.equal(shouldRunSessionMiddleware("/bolsa"), false);
  });

  it("corre middleware en rutas protegidas y auth/api", () => {
    assert.equal(shouldRunSessionMiddleware("/admin"), true);
    assert.equal(shouldRunSessionMiddleware("/perfil"), true);
    assert.equal(shouldRunSessionMiddleware("/asistencias"), true);
    assert.equal(shouldRunSessionMiddleware("/auth/callback"), true);
    assert.equal(shouldRunSessionMiddleware("/auth/login"), true);
    assert.equal(shouldRunSessionMiddleware("/api/newsletter"), true);
    assert.equal(shouldRunSessionMiddleware("/api/og"), true);
  });
});