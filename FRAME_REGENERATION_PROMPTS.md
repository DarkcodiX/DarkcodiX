# Character Frame Regeneration Prompts

Use these prompts to regenerate the broken character frames while keeping the animation smooth.

## Master Prompt

Use this same base prompt for every frame, then append the frame-specific direction from the table below.

```text
Edit this image only. Keep the exact same anime 3D boy character, same black glossy hoodie, same backpack straps, same necklace, same face proportions, same lighting direction, same camera distance, same full-body crop, and same 1920x1080 canvas.

Remove all broken white/gray/transparent-looking patches in the hair, hoodie, shoulders, sleeves, and outline. Repair the missing pixels naturally using the surrounding character details. Do not change the outfit design. Do not change the character identity. Do not add new objects. Do not crop. Do not zoom. Do not move the character position.

The background must be fully transparent alpha, not black, not gray, not white. Keep only the character visible. The edge of the character must be clean, smooth, anti-aliased, and consistent with the previous and next frames.

Important animation rule: this frame is part of a cursor-following sequence. The head/eyes must match the requested direction smoothly and must not jump toward the front/center pose unless the direction says center.

Output a transparent PNG at 1920x1080.
```

## Negative Prompt

Append this to every request if the tool supports negative instructions:

```text
No white holes, no gray holes, no black background, no black box, no broken alpha, no jagged outline, no missing hoodie parts, no missing hair pieces, no extra shine patches, no pose jump, no front-facing accidental frame, no crop change, no zoom change, no style change, no new clothing, no extra accessories.
```

## Top And Hoodie Repair Frames

These are mainly for the top-looking pose where the hoodie and upper outline were breaking. Keep the gaze smoothly moving upward.

| File | Frame Direction Prompt |
|---|---|
| `ezgif-frame-221.png` | Character looking diagonally up-right, between frame 211 and 231. Repair hoodie collar, shoulders, hair edge, and any missing white/gray patches. |
| `ezgif-frame-223.png` | Character looking diagonally up-right, slightly closer to top than frame 221. Smooth continuation, no pose jump. |
| `ezgif-frame-225.png` | Character looking diagonally up-right, eyes higher than frame 223. Repair hair gaps and hoodie gaps. |
| `ezgif-frame-227.png` | Character looking diagonally up-right, approaching full top look. Keep neck and hoodie aligned. |
| `ezgif-frame-229.png` | Character looking upward with a small right bias. Smoothly transition from frame 227 to 231. |
| `ezgif-frame-231.png` | Character looking upward with slight right bias. This is a key top transition frame. No broken shoulder/hoodie areas. |
| `ezgif-frame-233.png` | Character looking almost straight up. Preserve same scale and clean alpha edge. |
| `ezgif-frame-235.png` | Character looking almost straight up, between frames 233 and 237. No white holes near hair or hood. |
| `ezgif-frame-237.png` | Character looking straight up, slightly before the main top frame. Smooth eyes and head angle. |
| `ezgif-frame-239.png` | Character looking straight up, very close to frame 241. No jump, no center-facing look. |
| `ezgif-frame-241.png` | Character looking fully upward. This is the main top anchor frame. Repair all hoodie, hair, shoulder, and outline breaks. |
| `ezgif-frame-243.png` | Character looking upward with slight left bias. Must continue smoothly after frame 241. |
| `ezgif-frame-245.png` | Character looking upward-left, very slight left rotation. No accidental front-facing pose. |
| `ezgif-frame-247.png` | Character looking upward-left, a little more left than frame 245. Repair hair and hood edge. |
| `ezgif-frame-249.png` | Character looking upward-left. Smooth transition toward top-left. |
| `ezgif-frame-251.png` | Character looking upward-left. This frame previously showed visible breakage, repair all missing patches. |
| `ezgif-frame-253.png` | Character looking upward-left, slightly more left than frame 251. Keep the hoodie complete. |
| `ezgif-frame-255.png` | Character looking upward-left, moving toward left direction. No center pose. |
| `ezgif-frame-257.png` | Character looking upper-left. Repair outline flicker around hair and shoulders. |
| `ezgif-frame-259.png` | Character looking upper-left, close to the left transition. Keep motion continuous. |
| `ezgif-frame-261.png` | Character looking top-left. Must connect smoothly from frame 259 toward the left-facing sequence. |

## Left-To-Top Seam Frames

These are the frames that should fix the bump when moving from left to top. The current sequence accidentally feels like it passes through the initial/front pose. Regenerate these so the motion is a clean arc: left -> upper-left -> top.

| File | Frame Direction Prompt |
|---|---|
| `ezgif-frame-001.png` | Center/front idle frame. Keep this as the neutral starting pose, clean transparent background, no broken edges. |
| `ezgif-frame-003.png` | Almost center, starting to turn very slightly left. Smooth from frame 001, not a sudden direction change. |
| `ezgif-frame-005.png` | Slight left turn from center. Keep face natural and eyes following left softly. |
| `ezgif-frame-007.png` | Slight left turn, a little stronger than frame 005. |
| `ezgif-frame-009.png` | Center-left gaze, still close to neutral. No up/down jump. |
| `ezgif-frame-011.png` | Character looking center-left. Smooth continuation. |
| `ezgif-frame-013.png` | Character looking center-left, more left than frame 011. |
| `ezgif-frame-015.png` | Character looking left-center. Keep body and hoodie stable. |
| `ezgif-frame-017.png` | Character looking left-center with slightly stronger head rotation. |
| `ezgif-frame-019.png` | Character looking left-center, no front-facing reset. |
| `ezgif-frame-021.png` | Character looking left with mild rotation. |
| `ezgif-frame-023.png` | Character looking left, between frames 021 and 025. |
| `ezgif-frame-025.png` | Character looking left, smooth and stable. |
| `ezgif-frame-027.png` | Character looking left, slightly more side-facing. |
| `ezgif-frame-029.png` | Character looking left, no pose bump. |
| `ezgif-frame-031.png` | Character looking left. This is a left anchor helper frame. |
| `ezgif-frame-033.png` | Character looking left, slightly stronger than frame 031. |
| `ezgif-frame-035.png` | Character looking left, heading toward stronger left. |
| `ezgif-frame-037.png` | Character looking left, smooth continuation. |
| `ezgif-frame-039.png` | Character looking left, no center reset. |
| `ezgif-frame-041.png` | Character looking left, close to the main left pose. |
| `ezgif-frame-043.png` | Character looking left, slightly more side profile. |
| `ezgif-frame-045.png` | Character looking left, stable hoodie and hair outline. |
| `ezgif-frame-047.png` | Character looking left, no broken outline. |
| `ezgif-frame-049.png` | Character looking left, approaching frame 061. |
| `ezgif-frame-051.png` | Character looking left, stronger side angle. |
| `ezgif-frame-053.png` | Character looking left, smooth transition. |
| `ezgif-frame-055.png` | Character looking left, close to main left anchor. |
| `ezgif-frame-057.png` | Character looking left, very close to frame 061. |
| `ezgif-frame-059.png` | Character looking left, directly before frame 061. |
| `ezgif-frame-061.png` | Main left anchor frame. Character clearly looking left. Clean transparent background and stable outline. |
| `ezgif-frame-243.png` | Start of top-to-left arc. Character looking upward with slight left bias. Must not look front-facing. |
| `ezgif-frame-245.png` | Up-left gaze, a little more left than frame 243. |
| `ezgif-frame-247.png` | Up-left gaze, smooth head angle. |
| `ezgif-frame-249.png` | Up-left gaze, stronger left. |
| `ezgif-frame-251.png` | Up-left gaze, repair hoodie/shoulder breaks. |
| `ezgif-frame-253.png` | Up-left gaze, more left rotation. |
| `ezgif-frame-255.png` | Upper-left, no sudden front-facing frame. |
| `ezgif-frame-257.png` | Upper-left, nearing left direction. |
| `ezgif-frame-259.png` | Upper-left, smooth continuation. |
| `ezgif-frame-261.png` | Top-left transition frame. |
| `ezgif-frame-263.png` | Top-left moving toward left. |
| `ezgif-frame-265.png` | Top-left, slightly less upward. |
| `ezgif-frame-267.png` | Top-left, stronger left. |
| `ezgif-frame-269.png` | Top-left to left transition. |
| `ezgif-frame-271.png` | Left-up transition, no front/center pose. |
| `ezgif-frame-273.png` | Left-up transition, closer to left. |
| `ezgif-frame-275.png` | Left-up transition, smooth head movement. |
| `ezgif-frame-277.png` | Left-up transition, no jump. |
| `ezgif-frame-279.png` | Left-up transition, stable outline. |
| `ezgif-frame-281.png` | Left-up transition, approaching left. |
| `ezgif-frame-283.png` | Mostly left, slight upward bias. |
| `ezgif-frame-285.png` | Mostly left, smooth continuation. |
| `ezgif-frame-287.png` | Mostly left, no center reset. |
| `ezgif-frame-289.png` | Mostly left, close to left anchor. |
| `ezgif-frame-291.png` | Mostly left, very close to frame 061 pose. |
| `ezgif-frame-293.png` | Left-facing continuation, no jump. |
| `ezgif-frame-295.png` | Left-facing continuation, clean outline. |
| `ezgif-frame-297.png` | Left-facing continuation, stable hoodie and hair. |
| `ezgif-frame-299.png` | Left-facing continuation, should loop smoothly into frame 001 only when returning to idle, not during top-left movement. |
| `ezgif-frame-300.png` | End loop frame. Match frame 001 closely only for idle looping, with clean transparent background. |

## Bottom And Body Repair Frames

These are for the lower-looking pose where the bottom hoodie/sleeve/body area was breaking.

| File | Frame Direction Prompt |
|---|---|
| `ezgif-frame-101.png` | Character looking down-left or lower-left. Repair hoodie body and sleeve gaps. |
| `ezgif-frame-103.png` | Character looking slightly more downward than frame 101. Stable transparent outline. |
| `ezgif-frame-105.png` | Character looking down-left. No missing jacket pixels. |
| `ezgif-frame-107.png` | Character looking down-left, moving toward down. |
| `ezgif-frame-109.png` | Character looking down-left, close to downward pose. |
| `ezgif-frame-111.png` | Character looking downward-left. This frame needs clean hoodie and lower body repair. |
| `ezgif-frame-113.png` | Character looking downward, slight left bias. |
| `ezgif-frame-115.png` | Character looking downward. Repair any body/zipper/sleeve gaps. |
| `ezgif-frame-117.png` | Character looking downward. Smooth transition. |
| `ezgif-frame-119.png` | Character looking downward, close to main down frame. |
| `ezgif-frame-121.png` | Main downward anchor frame. Repair all bottom hoodie/sleeve/outline breakage. |
| `ezgif-frame-123.png` | Character looking downward, slight right bias. |
| `ezgif-frame-125.png` | Character looking down-right. Smooth continuation. |
| `ezgif-frame-127.png` | Character looking down-right, no missing hoodie pixels. |
| `ezgif-frame-129.png` | Character looking down-right. Clean alpha edge. |
| `ezgif-frame-131.png` | Character looking down-right. This frame needs body and sleeve repair. |
| `ezgif-frame-133.png` | Character looking down-right, moving toward right. |
| `ezgif-frame-135.png` | Character looking down-right. Stable outfit details. |
| `ezgif-frame-137.png` | Character looking down-right, no flicker at outline. |
| `ezgif-frame-139.png` | Character looking down-right, close to the next direction. |
| `ezgif-frame-141.png` | Character looking lower-right. Must connect smoothly after frame 139. |

## Best Manual Workflow

1. Start with these key frames first: `061`, `121`, `181`, `221`, `231`, `241`, `251`, `261`, `300`, `001`.
2. Then regenerate the in-between odd frames listed above.
3. If the tool can batch process, give it the master prompt plus the exact row prompt for each image.
4. Keep the canvas, crop, scale, outfit, and character position identical across all frames.
5. Export transparent PNG files with the exact same filenames.

## Most Important Fix

The biggest bump is caused by the seam between:

```text
ezgif-frame-241.png through ezgif-frame-300.png
ezgif-frame-001.png through ezgif-frame-061.png
```

That whole path must read as one smooth motion:

```text
top -> upper-left -> left
```

It must not become:

```text
top -> center/front -> left
```
