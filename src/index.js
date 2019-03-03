const axios = require("axios");
const qs = require("querystring");

class SpotifyWebApi {
  constructor(access_token) {
    this.access_token = access_token || null;
    if (!this.access_token) console.log("Please provide a access token!");
  }

  async performRequest(options) {
    try {
      let data = await axios({
        baseURL: "https://api.spotify.com/v1",
        headers: {
          Authorization: "Bearer " + this.access_token
        },
        reponseType: "json",
        url: options.url,
        method: options.method || "GET",
        params: options.params || null,
        data: options.data || null
      });

      return data;
    } catch (e) {
      throw e.response.data.error;
    }
  }

  /**
   *
   * Browse API
   *
   */

  /**
   * Get All Categories
   * Get a list of categories used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab).
   *
   * @param {String} country
   * @param {String} locale
   * @param {Integer} limit
   * @param {Integer} offset
   */

  async getCategories(country, locale, limit = 20, offset = 0) {
    return this.performRequest({
      url: "/browse/categories",
      params: {
        country,
        locale,
        limit,
        offset
      }
    });
  }

  /**
   * Get a Category
   * Get a single category used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab).
   *
   * @param {String} category_id
   * @param {String} country
   * @param {String} locale
   */

  async getCategory(category_id, country, locale) {
    return this.performRequest({
      url: `/browse/categories/${category_id}`,
      params: {
        country,
        locale
      }
    });
  }

  /**
   * Get a Category's Playlists
   * Get a list of Spotify playlists tagged with a particular category.
   *
   * @param {String} category_id
   * @param {String} country
   * @param {Integer} limit
   * @param {Integer} offset
   */

  async getCategoryPlaylist(category_id, country, limit = 20, offset = 0) {
    return this.performRequest({
      url: `/browse/categories/${category_id}/playlists`,
      params: {
        country,
        limit,
        offset
      }
    });
  }

  /**
   * Get Recommendations
   * Recommendations are generated based on the available information for a given seed entity and matched against
   * similar artists and tracks. If there is sufficient information about the provided seeds,
   * a list of tracks will be returned together with pool size details. For artists and tracks that are very new
   * or obscure there might not be enough data to generate a list of tracks.
   *
   * @param {Array} seed_artists
   * @param {Array} seed_genres
   * @param {Array} seed_tracks
   * @param {Integer} limit
   * @param {String} market
   * @param {Object} min_
   * @param {Object} max_
   * @param {Object} target_
   */

  async getRecommendations(
    seed_artists = [],
    seed_genres = [],
    seed_tracks = [],
    limit = 20,
    market,
    min_ = {},
    max_ = {},
    target_ = {}
  ) {
    let options = {
      url: "/recommendations",
      params: {
        seed_artists: [seed_artists].filter(Boolean).join(","),
        seed_genres: [seed_genres].filter(Boolean).join(","),
        seed_tracks: [seed_tracks].filter(Boolean).join(","),
        limit,
        market
      }
    };

    for (const [key, value] of Object.entries(min_)) {
      options.params[`min_${key}`] = value;
    }

    for (const [key, value] of Object.entries(max_)) {
      options.params[`max_${key}`] = value;
    }

    for (const [key, value] of Object.entries(target_)) {
      options.params[`target_${key}`] = value;
    }

    return this.performRequest(options);
  }

  /**
   * Get Recommendation Genres
   * Retrieve a list of available genres seed parameter values for recommendations.
   */

  async getRecommendationGenres() {
    return this.performRequest({
      url: "/recommendations/available-genre-seeds"
    });
  }

  /**
   * Get All New Releases
   * Get a list of new album releases featured in Spotify (shown, for example, on a Spotify player’s “Browse” tab).
   *
   * @param {String} country
   * @param {Integer} limit
   * @param {Integer} offset
   */

  async getNewReleases(country, limit = 20, offset = 0) {
    return this.performRequest({
      url: "/browse/new-releases",
      params: {
        country,
        limit,
        offset
      }
    });
  }

  /**
   * Get All Featured Playlists
   * Get a list of Spotify featured playlists (shown, for example, on a Spotify player’s ‘Browse’ tab).
   *
   * @param {String} country
   * @param {String} locale
   * @param {Date} timestamp
   * @param {Integer} limit
   * @param {Integer} offset
   */

  async getFeaturedPlaylists(
    country,
    locale,
    timestamp,
    limit = 20,
    offset = 0
  ) {
    return this.performRequest({
      url: "/browse/featured-playlists",
      params: {
        country,
        locale,
        timestamp,
        limit,
        offset
      }
    });
  }

  /**
   *
   * Artists API
   *
   */

  /**
   * Get Multiple Artists
   * Get Spotify catalog information for several artists based on their Spotify IDs.
   *
   * @param {Array} ids
   */

  async getArtists(ids = []) {
    return this.performRequest({
      url: "/artists",
      params: {
        ids: [ids].filter(Boolean).join(",")
      }
    });
  }

  /**
   * Get an Artist's Albums
   * Get Spotify catalog information about an artist’s albums.
   * Optional parameters can be specified in the query string to filter and sort the response.
   *
   * @param {String} id
   */

  async getArtist(id) {
    return this.performRequest({
      url: `/artists/${id}`
    });
  }

  /**
   * Get an Artist's Albums
   * Get Spotify catalog information about an artist’s albums.
   * Optional parameters can be specified in the query string to filter and sort the response.
   *
   * @param {String} id
   * @param {Array} include_groups
   * @param {String} market
   * @param {Integer} limit
   * @param {Integer} offset
   */

  async getArtistsAlbums(
    id,
    include_groups = ["single", "appears_on"],
    market,
    limit = 20,
    offset = 0
  ) {
    return this.performRequest({
      url: `/artists/${id}/albums`,
      params: {
        include_groups: [include_groups].filter(Boolean).join(","),
        market,
        limit,
        offset
      }
    });
  }

  /**
   * Get an Artist's Top Tracks
   * Get Spotify catalog information about an artist’s top tracks by country.
   *
   * @param {String} id
   * @param {String} market
   */

  async getArtistsTopTracks(id, market) {
    return this.performRequest({
      url: `/artists/${id}/top-tracks`,
      params: {
        market
      }
    });
  }

  /**
   * Get an Artist's Related Artists
   * Get Spotify catalog information about artists similar to a given artist.
   * Similarity is based on analysis of the Spotify community’s listening history.
   *
   * @param {String} id
   */

  async getRelatedArtists(id) {
    return this.performRequest({
      url: `/artists/${id}/related-artists`
    });
  }

  /**
   *
   * Search API
   *
   */

  /**
   * Search for an Item
   * Get Spotify Catalog information about artists, albums, tracks or playlists that match a keyword string.
   *
   * @param {String} q
   * @param {Array} type
   * @param {String} market
   * @param {Integer} limit
   * @param {Integer} offset
   * @param {Integer} include_external
   */

  async searchItem(
    q,
    type = ["track", "artist"],
    market,
    limit = 20,
    offset = 0,
    include_external
  ) {
    return this.performRequest({
      url: "/search",
      params: {
        q: qs.escape(q),
        type: [type].filter(Boolean).join(","),
        market,
        limit,
        offset,
        include_external
      }
    });
  }
}

module.exports = SpotifyWebApi;
