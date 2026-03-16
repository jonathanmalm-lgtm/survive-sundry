import posthog from 'posthog-js'

// All tracking calls are no-ops if PostHog was never initialised.

export const analytics = {
  gameStarted(role: string) {
    posthog.capture('game_started', { role })
  },

  sceneCompleted(scene: number, role: string, choiceType: string) {
    posthog.capture('scene_completed', { scene, role, choice_type: choiceType })
  },

  nuclearResolved(scene: number, role: string, outcome: 'win' | 'lose') {
    posthog.capture('nuclear_resolved', { scene, role, outcome })
  },

  meetingReached(role: string, endingId: number, specialVariants: string[]) {
    posthog.capture('meeting_reached', {
      role,
      ending_id: endingId,
      special_variants: specialVariants,
    })
  },

  imageShared(method: 'webshare' | 'download' | 'copylink', endingId: number, role: string) {
    posthog.capture('image_shared', { method, ending_id: endingId, role })
  },
}
