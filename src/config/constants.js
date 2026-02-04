/**
 * Configuration constants
 * Centralized configuration values used across the application
 */

/**
 * Connection retry configuration
 */
export const RETRY_CONFIG = {
  MAX_RETRIES: 10,
  DELAY_MS: 5000,
};

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG = {
  host: '127.0.0.1',
  port: 19132,
  gamertag: 'Bot',
  reconnect: 10,
  offline: true,
  debug: false,
};

/**
 * Authentication error patterns for error detection
 */
export const AUTH_ERROR_PATTERNS = ['authentication', 'auth', 'Auth', 'invalid_grant', 'device code', 'post_request_failed', 'fetch failed'];

/**
 * Transient network error patterns that should be suppressed during auth
 */
export const TRANSIENT_NETWORK_ERROR_PATTERNS = ['ECONNABORTED', 'ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND', 'fetch failed'];

/**
 * Console filter patterns for noisy logs
 */
export const FILTER_PATTERNS = [
  /^\{/, // JSON error messages
  /^\[msa\]/, // MSA authentication spam
  /^TypeError: fetch failed/, // Transient network errors during auth
  /^Connecting to/, // bedrock-protocol connection messages
  /^Server requested disconnect/, // bedrock-protocol disconnect messages
];

/**
 * Translation message mappings for game events
 */
export const TRANSLATION_MESSAGES = {
  'chat.type.achievement': '%s has just earned the achievement %s',
  'chat.type.achievement.taken': '%s has lost the achievement %s',
  'chat.type.admin': '[%s: %s]',
  'chat.type.announcement': '[%s] %s',
  'chat.type.emote': '* %s %s',
  'chat.type.sleeping': '%s is sleeping in a bed. To skip to dawn, %s more players need to sleep in beds at the same time.',
  'chat.type.text': '<%s> %s',
  'chat.renamed': "You have been temporarily renamed to '%s' on this server",
  'multiplayer.player.inventory.recovered': 'Inventory recovered and placed in chests near you.',
  'multiplayer.player.inventory.failed': "Inventory recovered. Find a safe place, and we'll place a chest near you the next time you join the world.",
  'multiplayer.player.joined': '%s joined the game',
  'multiplayer.player.joined.renamed': '%s (formerly known as %s) joined the game',
  'multiplayer.player.joined.realms': '%s joined the Realm',
  'multiplayer.player.joined.realms.renamed': '%s (formerly known as %s) joined the Realm',
  'multiplayer.player.left': '%s left the game',
  'multiplayer.player.left.realms': '%s left the Realm',
  'multiplayer.player.changeToPersona': '%s edited the character appearance.',
  'multiplayer.player.changeToSkin': '%s has changed their skin.',
  'multiplayer.playersSkippingNight': 'Sleeping through this night',
};

/**
 * Disconnect message translations
 */
export const DISCONNECT_MESSAGES = {
  'disconnect.closed': 'Connection closed',
  'disconnect.downloadPack': 'Error while downloading packs from server. Please try again.',
  'disconnect.disconnected': 'Disconnected by Server',
  'disconnect.endOfStream': 'End of stream',
  'disconnect.genericReason': '%s',
  'disconnect.kicked': 'You were kicked from the game',
  'disconnect.kicked.reason': 'You were kicked from the game:',
  'disconnect.removed': 'You were removed from the game',
  'disconnect.removed.reason': 'You were removed from the game:',
  'disconnect.loginFailed': 'Failed to login',
  'disconnect.loginFailedInfo': 'Failed to login: %s',
  'disconnect.loginFailedInfo.environmentMismatch': 'Playfab environment mismatch - Discovery=%s/%s, Playfab=%s/%s',
  'disconnect.loginFailedInfo.invalidSession': 'Invalid session (Try restarting your game)',
  'disconnect.loginFailedInfo.serversUnavailable': 'The authentication servers are currently down for maintenance.',
  'disconnect.lost': 'Connection Lost',
  'disconnect.overflow': 'Buffer overflow',
  'disconnect.quitting': 'Quitting',
  'disconnect.spam': 'Kicked for spamming',
  'disconnect.timeout': 'Timed out',
  'disconnect.scriptWatchdog': 'The server was shut down due to an unhandled scripting watchdog exception.',
  'disconnect.scriptWatchdogOutOfMemory': 'The server was shut down due to exceeding the scripting memory limit.',
};

/**
 * Death message translations
 */
export const DEATH_ATTACK_MESSAGES = {
  'death.attack.anvil': '%1$s was squashed by a falling anvil',
  'death.attack.arrow': '%1$s was shot by %2$s',
  'death.attack.arrow.item': '%1$s was shot by %2$s using %3$s',
  'death.attack.bullet': '%1$s was sniped by %2$s',
  'death.attack.cactus': '%1$s was pricked to death',
  'death.attack.cactus.player': '%1$s walked into a cactus whilst trying to escape %2$s',
  'death.attack.dehydration': '%1$s died from dehydration',
  'death.attack.drown': '%1$s drowned',
  'death.attack.drown.player': '%1$s drowned whilst trying to escape %2$s',
  'death.attack.explosion': '%1$s blew up',
  'death.attack.explosion.by.bed': '%1$s was killed by [Intentional Game Design]',
  'death.attack.explosion.player': '%1$s was blown up by %2$s',
  'death.attack.fall': '%1$s hit the ground too hard',
  'death.attack.fallingBlock': '%1$s was squashed by a falling block',
  'death.attack.fireball': '%1$s was fireballed by %2$s',
  'death.attack.fireball.item': '%1$s was fireballed by %2$s using %3$s',
  'death.attack.fireworks': '%1$s went off with a bang',
  'death.attack.flyIntoWall': '%1$s experienced kinetic energy',
  'death.attack.generic': '%1$s died',
  'death.attack.indirectMagic': '%1$s was killed by %2$s using magic',
  'death.attack.indirectMagic.item': '%1$s was killed by %2$s using %3$s',
  'death.attack.inFire': '%1$s went up in flames',
  'death.attack.inFire.player': '%1$s walked into fire whilst fighting %2$s',
  'death.attack.inWall': '%1$s suffocated in a wall',
  'death.attack.lava': '%1$s tried to swim in lava',
  'death.attack.lava.player': '%1$s tried to swim in lava to escape %2$s',
  'death.attack.lightningBolt': '%1$s was struck by lightning',
  'death.attack.maceSmash.player': '%1$s was smashed by %2$s',
  'death.attack.maceSmash.player.item': '%1$s was smashed by %2$s with %3$s',
  'death.attack.magic': '%1$s was killed by magic',
  'death.attack.magma': '%1$s discovered the floor was lava',
  'death.attack.magma.player': '%1$s walked on danger zone due to %2$s',
  'death.attack.mob': '%1$s was slain by %2$s',
  'death.attack.mob.item': '%1$s was slain by %2$s using %3$s',
  'death.attack.onFire': '%1$s burned to death',
  'death.attack.onFire.player': '%1$s was burnt to a crisp whilst fighting %2$s',
  'death.attack.outOfWorld': '%1$s fell out of the world',
  'death.attack.player': '%1$s was slain by %2$s',
  'death.attack.player.item': '%1$s was slain by %2$s using %3$s',
  'death.attack.spit': '%1$s was spitballed by %2$s',
  'death.attack.starve': '%1$s starved to death',
  'death.attack.sweetBerry': '%1$s was poked to death by a sweet berry bush',
  'death.attack.thorns': '%1$s was killed trying to hurt %2$s',
  'death.attack.thrown': '%1$s was pummeled by %2$s',
  'death.attack.thrown.item': '%1$s was pummeled by %2$s using %3$s',
  'death.attack.trident': '%1$s was impaled to death by %2$s',
  'death.attack.wither': '%1$s withered away',
  'death.attack.freeze': '%1$s froze to death',
  'death.attack.sonicBoom': '%1$s was obliterated by a sonically-charged shriek',
  'death.attack.sonicBoom.player': '%1$s was obliterated by a sonically-charged shriek whilst trying to escape %2$s',
  'death.attack.stalactite': '%1$s was skewered by a falling stalactite',
  'death.attack.stalagmite': '%1$s was impaled on a stalagmite',
};

/**
 * Fall death messages
 */
export const DEATH_FELL_MESSAGES = {
  'death.fell.accident.generic': '%1$s fell from a high place',
  'death.fell.accident.ladder': '%1$s fell off a ladder',
  'death.fell.accident.vines': '%1$s fell off some vines',
  'death.fell.accident.water': '%1$s fell out of the water',
  'death.fell.assist': '%1$s was doomed to fall by %2$s',
  'death.fell.assist.item': '%1$s was doomed to fall by %2$s using %3$s',
  'death.fell.finish': '%1$s fell too far and was finished by %2$s',
  'death.fell.finish.item': '%1$s fell too far and was finished by %2$s using %3$s',
  'death.fell.killer': '%1$s was doomed to fall',
};

/**
 * Entity name translations
 */
export const ENTITY_NAMES = {
  'entity.armadillo.name': 'Armadillo',
  'entity.armor_stand.name': 'Armor Stand',
  'entity.arrow.name': 'Arrow',
  'entity.bat.name': 'Bat',
  'entity.bee.name': 'Bee',
  'entity.blaze.name': 'Blaze',
  'entity.boat.name': 'Boat',
  'entity.bogged.name': 'Bogged',
  'entity.breeze.name': 'Breeze',
  'entity.breeze_wind_charge_projectile.name': 'Wind Charge',
  'entity.cat.name': 'Cat',
  'entity.cave_spider.name': 'Cave Spider',
  'entity.chicken.name': 'Chicken',
  'entity.cow.name': 'Cow',
  'entity.creaking.name': 'Creaking',
  'entity.creeper.name': 'Creeper',
  'entity.dolphin.name': 'Dolphin',
  'entity.goat.name': 'Goat',
  'entity.panda.name': 'Panda',
  'entity.donkey.name': 'Donkey',
  'entity.dragon_fireball.name': 'Dragon Fireball',
  'entity.drowned.name': 'Drowned',
  'entity.egg.name': 'Egg',
  'entity.elder_guardian.name': 'Elder Guardian',
  'entity.ender_crystal.name': 'Ender Crystal',
  'entity.ender_dragon.name': 'Ender Dragon',
  'entity.enderman.name': 'Enderman',
  'entity.endermite.name': 'Endermite',
  'entity.ender_pearl.name': 'Ender Pearl',
  'entity.evocation_illager.name': 'Evoker',
  'entity.evocation_fang.name': 'Evoker Fang',
  'entity.eye_of_ender_signal.name': 'Eye of Ender',
  'entity.falling_block.name': 'Falling Block',
  'entity.fireball.name': 'Fireball',
  'entity.fireworks_rocket.name': 'Firework Rocket',
  'entity.fishing_hook.name': 'Fishing Hook',
  'entity.fish.clownfish.name': 'Clownfish',
  'entity.fox.name': 'Fox',
  'entity.cod.name': 'Cod',
  'entity.pufferfish.name': 'Pufferfish',
  'entity.salmon.name': 'Salmon',
  'entity.tropicalfish.name': 'Tropical Fish',
  'entity.axolotl.name': 'Axolotl',
  'entity.ghast.name': 'Ghast',
  'entity.glow_squid.name': 'Glow Squid',
  'entity.piglin_brute.name': 'Piglin Brute',
  'entity.guardian.name': 'Guardian',
  'entity.hoglin.name': 'Hoglin',
  'entity.horse.name': 'Horse',
  'entity.husk.name': 'Husk',
  'entity.ravager.name': 'Ravager',
  'entity.iron_golem.name': 'Iron Golem',
  'entity.item.name': 'Item',
  'entity.leash_knot.name': 'Leash Knot',
  'entity.lightning_bolt.name': 'Lightning Bolt',
  'entity.lingering_potion.name': 'Lingering Potion',
  'entity.llama.name': 'Llama',
  'entity.trader_llama.name': 'Trader Llama',
  'entity.llama_spit.name': 'Llama Spit',
  'entity.magma_cube.name': 'Magma Cube',
  'entity.minecart.name': 'Minecart',
  'entity.chest_minecart.name': 'Minecart with Chest',
  'entity.command_block_minecart.name': 'Minecart with Command Block',
  'entity.furnace_minecart.name': 'Minecart with Furnace',
  'entity.hopper_minecart.name': 'Minecart with Hopper',
  'entity.tnt_minecart.name': 'Minecart with TNT',
  'entity.mule.name': 'Mule',
  'entity.mooshroom.name': 'Mooshroom',
  'entity.moving_block.name': 'Moving Block',
  'entity.ocelot.name': 'Ocelot',
  'entity.painting.name': 'Painting',
  'entity.parrot.name': 'Parrot',
  'entity.phantom.name': 'Phantom',
  'entity.pig.name': 'Pig',
  'entity.piglin.name': 'Piglin',
  'entity.pillager.name': 'Pillager',
  'entity.polar_bear.name': 'Polar Bear',
  'entity.rabbit.name': 'Rabbit',
  'entity.sheep.name': 'Sheep',
  'entity.shulker.name': 'Shulker',
  'entity.shulker_bullet.name': 'Shulker Bullet',
  'entity.silverfish.name': 'Silverfish',
  'entity.skeleton.name': 'Skeleton',
  'entity.skeleton_horse.name': 'Skeleton Horse',
  'entity.stray.name': 'Stray',
  'entity.slime.name': 'Slime',
  'entity.small_fireball.name': 'Small Fireball',
  'entity.sniffer.name': 'Sniffer',
  'entity.snowball.name': 'Snowball',
  'entity.snow_golem.name': 'Snow Golem',
  'entity.spider.name': 'Spider',
  'entity.splash_potion.name': 'Potion',
  'entity.squid.name': 'Squid',
  'entity.strider.name': 'Strider',
  'entity.tnt.name': 'Block of TNT',
  'entity.thrown_trident.name': 'Trident',
  'entity.tripod_camera.name': 'Tripod Camera',
  'entity.turtle.name': 'Turtle',
  'entity.unknown.name': 'Unknown',
  'entity.vex.name': 'Vex',
  'entity.villager.name': 'Villager',
  'entity.villager.armor': 'Armorer',
  'entity.villager.butcher': 'Butcher',
  'entity.villager.cartographer': 'Cartographer',
  'entity.villager.cleric': 'Cleric',
  'entity.villager.farmer': 'Farmer',
  'entity.villager.fisherman': 'Fisherman',
  'entity.villager.fletcher': 'Fletcher',
  'entity.villager.leather': 'Leatherworker',
  'entity.villager.librarian': 'Librarian',
  'entity.villager.shepherd': 'Shepherd',
  'entity.villager.tool': 'Tool Smith',
  'entity.villager.weapon': 'Weapon Smith',
  'entity.villager.mason': 'Mason',
  'entity.villager.unskilled': 'Unskilled Villager',
  'entity.villager_v2.name': 'Villager',
  'entity.vindicator.name': 'Vindicator',
  'entity.wandering_trader.name': 'Wandering Trader',
  'entity.wind_charge_projectile.name': 'Wind Charge',
  'entity.witch.name': 'Witch',
  'entity.wither.name': 'Wither',
  'entity.wither_skeleton.name': 'Wither Skeleton',
  'entity.wither_skull.name': 'Wither Skull',
  'entity.wither_skull_dangerous.name': 'Wither Skull',
  'entity.wolf.name': 'Wolf',
  'entity.xp_orb.name': 'Experience Orb',
  'entity.xp_bottle.name': "Bottle o' Enchanting",
  'entity.zoglin.name': 'Zoglin',
  'entity.zombie.name': 'Zombie',
  'entity.zombie_horse.name': 'Zombie Horse',
  'entity.zombie_pigman.name': 'Zombified Piglin',
  'entity.zombie_villager.name': 'Zombie Villager',
  'entity.zombie_villager_v2.name': 'Zombie Villager',
};
