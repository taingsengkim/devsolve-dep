import { expect, test } from "@playwright/test";

import {
  buildCreateCommentBody,
  type CreateCommentInput,
} from "../src/lib/comments/payload";
import {
  COMMENTABLE_TYPES,
  commentCreateSchema,
} from "../src/lib/validations/engagement";

/**
 * Guards the shape of `POST /api/v1/comments`.
 *
 * The backend binds `internal` to a non-nullable boolean, so a body without it
 * fails to deserialize and comes back as "The request body is missing or is
 * not valid JSON" — an error that points at the whole body rather than the one
 * absent field, which is what made it expensive to find. These assertions fail
 * loudly if a submission ever drops it again.
 */

const SHOWCASE_ID = "a1445d37-c442-49af-8602-2dd054c29843";

test.describe("create-comment payload", () => {
  test("carries every field the backend binds", () => {
    const body = buildCreateCommentBody({
      commentableType: "SHOWCASE",
      commentableId: SHOWCASE_ID,
      content: "kokkk",
    });

    expect(body).toEqual({
      commentableType: "SHOWCASE",
      commentableId: SHOWCASE_ID,
      content: "kokkk",
      parentCommentId: null,
      internal: false,
      mentionedUserIds: [],
    });
  });

  test("always includes internal, defaulting to false", () => {
    const cases: CreateCommentInput[] = [
      { commentableType: "SHOWCASE", commentableId: SHOWCASE_ID, content: "a" },
      {
        commentableType: "PROBLEM",
        commentableId: SHOWCASE_ID,
        content: "a reply",
        parentCommentId: "d5980bb0-ef5a-48ab-862f-4914d187b758",
      },
      {
        commentableType: "REPORT",
        commentableId: SHOWCASE_ID,
        content: "team only",
        internal: true,
      },
    ];

    for (const input of cases) {
      const body = buildCreateCommentBody(input);
      expect(body).toHaveProperty("internal");
      expect(typeof body.internal).toBe("boolean");
      expect(body.internal).toBe(input.internal ?? false);
    }
  });

  test("a reply serialises to the same shape as a top-level comment", () => {
    const parentCommentId = "d5980bb0-ef5a-48ab-862f-4914d187b758";
    const top = buildCreateCommentBody({
      commentableType: "SHOWCASE",
      commentableId: SHOWCASE_ID,
      content: "top",
    });
    const reply = buildCreateCommentBody({
      commentableType: "SHOWCASE",
      commentableId: SHOWCASE_ID,
      content: "reply",
      parentCommentId,
    });

    expect(Object.keys(reply).sort()).toEqual(Object.keys(top).sort());
    expect(reply.parentCommentId).toBe(parentCommentId);
    expect(top.parentCommentId).toBeNull();
  });

  test("survives JSON.stringify with internal intact", () => {
    const serialised = JSON.stringify(
      buildCreateCommentBody({
        commentableType: "SHOWCASE",
        commentableId: SHOWCASE_ID,
        content: "kokkk",
      }),
    );

    expect(typeof serialised).toBe("string");
    expect(JSON.parse(serialised)).toHaveProperty("internal", false);
  });

  test("commentableType stays uppercase and within the enum", () => {
    for (const type of COMMENTABLE_TYPES) {
      const body = buildCreateCommentBody({
        commentableType: type,
        commentableId: SHOWCASE_ID,
        content: "x",
      });
      expect(body.commentableType).toBe(type.toUpperCase());
      expect(COMMENTABLE_TYPES).toContain(body.commentableType);
    }
  });

  /* The proxy forwards `parsed.data`, not the raw request, so the schema has
     to reinstate the fields as well — a client that predates this still gets a
     complete body. */
  test("the proxy schema fills the fields back in when a caller omits them", () => {
    const parsed = commentCreateSchema.safeParse({
      commentableType: "SHOWCASE",
      commentableId: SHOWCASE_ID,
      content: "kokkk",
    });

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    expect(parsed.data).toEqual({
      commentableType: "SHOWCASE",
      commentableId: SHOWCASE_ID,
      content: "kokkk",
      parentCommentId: null,
      internal: false,
      mentionedUserIds: [],
    });
    expect(JSON.parse(JSON.stringify(parsed.data))).toHaveProperty(
      "internal",
      false,
    );
  });
});
