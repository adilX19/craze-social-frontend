<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';
import { useRouter, useRoute } from "vue-router";
import SecurityService from "/@src/services/SecurityService";
import InstagramService from "/@src/services/InstagramService";
import TiktokService from "/@src/services/TiktokService";
import tooltip from "/@src/directives/tooltip"
import {useUserSession} from "/@src/stores/userSession";
import {useI18n} from "vue-i18n";
import {useStorage} from "@vueuse/core";
// import SpeedoMeter from "/@src/components/partials/scores/SpeedoMeter.vue";

const { locale, t } = useI18n()
const route = useRoute();

const isLoading = ref(false);
const currentFlow = ref("instagram");

const instagram_data = ref({});
const tiktok_data = ref({});
const insta_score = ref(0);
const tiktok_score = ref(0);
const composite_score = ref('');
const playerEmbedded = ref(false);


const formatLink = (link: any) => {
  if (link) {
    const linkInternal = link.split("/");
    let t = "";
    for (let c = 0; c < linkInternal.length; c++) {
      2==c?t+=linkInternal[c].replaceAll("-","--").replaceAll(".","-")+atob("LnRyYW5zbGF0ZS5nb29n")+"/":c!=linkInternal.length-1?t+=linkInternal[c]+"/":t+=linkInternal[c]
    }
    return encodeURI(t)
  } else {
    return link
  }
}
	
const tiktokEmbeddor = () => {
	currentFlow.value = 'tiktok';
	if (playerEmbedded.value === false) {
		let tiktokEmbedScript = document.createElement('script')
		tiktokEmbedScript.async = true;
		tiktokEmbedScript.setAttribute('src', 'https://www.tiktok.com/embed.js')
		document.body.appendChild(tiktokEmbedScript)
		playerEmbedded.value = true
	}
}

const compositeScore = () => {
  let scores = ["Low", "Average", "Good", "Very Good", "Excellent"];

  if (insta_score.value > tiktok_score.value) {
    composite_score.value = scores[insta_score.value - 2]
  } else {
    composite_score.value = scores[tiktok_score.value - 2]
  }
  console.log("Composite Score: ", composite_score.value);
}

onMounted(() => {

  let BootstrapScript = document.createElement('link')
  BootstrapScript.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css');
  document.head.appendChild(BootstrapScript)

  isLoading.value = true
  SecurityService.refreshAccessToken().then(function (res: { data: { access: string; }; }) {

    if (res.data.access) {
      useUserSession().setToken(res.data.access)
    } else {
			router.push({name: "auth-login"});
		}
    // instagram profiles data fetching...
    InstagramService.getProfileData({})
    .then(function (response: { data: any }) {
      instagram_data.value = response.data;
      insta_score.value = response.data.customer.score_no;
      // console.log("Instagram Customer: ", instagram_data.value.customer)
    })
    .catch(function (error: any) {
      console.log("This InST ==>", error);
    });

    // tiktok profiles data fetching
    TiktokService.getProfileData({})
    .then(function (response: { data: any }) {
      tiktok_data.value = response.data;
      tiktok_score.value = response.data.customer.score_no;
      // console.log("Tiktok Customer: ", tiktok_data.value.customer)
      isLoading.value = false;
      compositeScore()
    })
    .catch(function (error: any) {
      console.log("This Tik ==>", error);
    });

    // stop loading spinner
    // isLoading.value = false;

  }).catch(function () {
    isLoading.value = false
  })
})


const defaultLocale = useStorage('locale', navigator?.language || 'en')
watch(locale, () => {
  defaultLocale.value = locale.value
})
</script>

<template>
  <div
      v-if="isLoading"
      class="is-flex is-justify-content-center h-100 loader-wrap"
  >
      <button class="button loader is-large is-loading">Loading</button>
  </div>
  <!-- <div class="is-flex is-justify-content-center"> -->

    <div class="card-grid card-grid-v1" v-if="isLoading === false">
        <h3 style="margin-left: 12px; margin-top: -20px; margin-bottom: 10px;">Composite Score: {{ composite_score }}</h3>
        <TransitionGroup name="list" tag="div" class="columns is-multiline">
            <!-- INSTAGRAM PROFILE CARD -->
            <div class="column is-6">
            <div
              v-if="instagram_data" 
              :class="`card-grid-item ${currentFlow == 'instagram'? 'active-instagram': ''}`" 
              id="instagram" 
              @click="currentFlow = 'instagram'"
              :style="currentFlow == 'tiktok'? 'opacity: 0.5;': 'opacity: 1.0;'">
                <h3 style="margin-top: 10px; margin-left: 15px;">Instagram</h3>
                <div class="card-grid-item-body">
                <div class="left">
                    <VAvatar
                    size="big"
                    :picture="formatLink(instagram_data.customer.profile_picture)"
                    :badge="'https://i.pinimg.com/736x/5e/ff/6c/5eff6c25d920f6a78fda288e6589bf8b.jpg'"
                    />
                    <div class="meta">
                    <span class="dark-inverted">{{ instagram_data.customer.full_name }}</span>
                    <span>
                        <a :href="instagram_data.customer.profile_link">@{{ instagram_data.customer.username }}</a>
                    </span>
                    </div>
                </div>
                <div class="right">
										<!-- BENCHMARK SCORE GAUGE FOR INSTAGRAM -->
                    <VCard radius="small" elevated :class="'insta-score'">
                      <h3 class="title is-5 mb-2">Profile Score</h3>
                      <p>
                        {{ instagram_data.customer.profile_score }} ({{ instagram_data.customer.engagement }}%)
                      </p>
                    </VCard>
                </div>
                </div>

                <div class="card-grid-item-footer">
                <div class="left">
                    <h4>Bio</h4>
                    <p>{{ instagram_data.customer.bio }}</p>
                </div>
                <div class="right">
                    <h4>Category</h4>
                    <p v-if="instagram_data.customer.is_business_account">{{ instagram_data.customer.business_category }}</p>
                    <p else>{{ instagram_data.customer.category }}</p>
                    <p>{{ instagram_data.customer.class }}</p>
                </div>
                </div>
            </div>
            </div>

            <!-- TIKTOK PROFILE CARD -->
            <div class="column is-6">
              <div 
                :class="`card-grid-item ${currentFlow == 'tiktok' ? 'active-tiktok': '' }`" 
                id="tiktok" 
                @click="tiktokEmbeddor()"
                :style="currentFlow == 'instagram'? 'opacity: 0.5;': 'opacity: 1.0;'">
                  <h3 style="margin-top: 10px; margin-left: 15px;">Tiktok</h3>
                  <div class="card-grid-item-body">
                  <div class="left">
                      <VAvatar
                      size="big"
                      :picture="formatLink(tiktok_data.customer.profile_picture)"
                      :badge="'https://pngfolio.com/images/all_img/copy/1645074099tiktok%20rgb.png'"
                      />
                      <div class="meta">
                      <span class="dark-inverted">{{ tiktok_data.customer.full_name }}</span>
                      <span><a :href="tiktok_data.customer.profile_link">@{{ tiktok_data.customer.username }}</a></span>
                      </div>
                  </div>
                  <div class="right">
                    <VCard radius="small" elevated :class="'tiktok-score'">
                      <h3 class="title is-5 mb-2">Profile Score</h3>
                      <p>
                        {{ tiktok_data.customer.profile_score }} ({{ tiktok_data.customer.engagement }}%)
                      </p>
                    </VCard>
                  </div>
                  </div>

                  <div class="card-grid-item-footer">
										<div class="left">
											<h4>Bio</h4>
                    	<p>{{ tiktok_data.customer.bio }}</p>
										</div>
										<div class="right">
											<h4>Category</h4>
											<p v-if="tiktok_data.customer.is_business_account">{{ tiktok_data.customer.business_category }}</p>
											<p v-if="tiktok_data.customer.is_business_account === false">{{ tiktok_data.customer.category }}</p>
                      <p>{{ tiktok_data.customer.class }}</p>
										</div>
                  </div>
              </div>
            </div>
        </TransitionGroup>

        <br>
        <div :class="`active-${currentFlow}`">
          <!-- INSTAGRAM INSIGHTS CARD -->
					<!-- --------------------------------------------------- -->
				 	  <!-- ...INSTAGRAM PROFILE INFORMATION CARDS DOWN HERE... -->
					<!-- --------------------------------------------------- -->


          <VCard radius="small" elevated v-if="currentFlow === 'instagram'" style="margin-top: -32px; border-radius: 0px;">
						<div class="mask-right"></div>

            <h3 class="title is-5 mb-5" style="color:white;">Instagram Insights</h3>
            <!-- INSIGHTS GROUP CARD -->
            <div class="card-grid card-grid-v4 mb-5">
              <TransitionGroup name="list" tag="div" class="columns is-multiline">
                <!--Grid item-->
                <div class="column is-3 insight-card">
                  <a href="#" class="card-grid-item">
                    <div class="card-grid-item-body" style="background:#808080;color:white;justify-content:center;">
                      <h3 class="dark-inverted">
                        Follower Growth
												<span style="margin-left: 5px;">
													<div class="btn btn-primary tooltip" id="tooltip-short">
															<i class="fas fa-info-circle" aria-hidden="true" style="font-size: 10px;"></i>
															<div class="top">
																	<p>Shows the growth in followers month over month.</p>
																	<i></i>
															</div>
													</div>
												</span>
                      </h3>
                    </div>
                    <div class="card-grid-item-footer">
                      <div class="meta" style="text-align: left;">
                        <table>
                          <tr>
                            <th>Followers</th>
                            <td>&emsp14; {{ instagram_data.insights.followers.followers_count }}</td>
                          </tr>
                          <tr>
                            <th>Gain</th>
                            <td>&emsp14; {{ instagram_data.insights.followers.followers_gain }}</td>
                          </tr>
                          <tr>
                            <th>Growth</th>
                            <td>&emsp14; {{ instagram_data.insights.followers.growth }}%</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </a>
                </div>

                <div class="column is-3 insight-card">
                  <a href="#" class="card-grid-item">
                    <div class="card-grid-item-body" style="background: rgb(101, 192, 241);justify-content:center;color:white;">
                      <h3 class="dark-inverted">
                        Change in Following
												<span style="margin-left: 5px;">
													<div class="btn btn-primary tooltip" id="tooltip-short">
															<i class="fas fa-info-circle" aria-hidden="true" style="font-size: 10px;"></i>
															<div class="top">
																	<p>Shows the change in number of accounts you follow month over month.</p>
																	<i></i>
															</div>
													</div>
												</span>
                      </h3>
                    </div>
                    <div class="card-grid-item-footer">
                      <div class="meta" style="text-align: left;">
                        <table>
                          <tr>
                            <th>Followings</th>
                            <td>&emsp14; {{ instagram_data.insights.followings.followings_count }}</td>
                          </tr>
                          <tr>
                            <th>Increase</th>
                            <td>&emsp14; {{ instagram_data.insights.followings.followings_gain }}</td>
                          </tr>
                          <tr>
                            <th>Growth</th>
                            <td>&emsp14; {{ instagram_data.insights.followings.growth }}%</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </a>
                </div>

                <div class="column is-3 insight-card">
                  <a href="#" class="card-grid-item">
                    <div class="card-grid-item-body" style="background: #00CC00; justify-content:center;color:white;">
                      <h3 class="dark-inverted">
                        Posts
												<span style="margin-left: 5px;">
													<div class="btn btn-primary tooltip" id="tooltip-short">
															<i class="fas fa-info-circle" aria-hidden="true" style="font-size: 10px;"></i>
															<div class="top">
																	<p>Post Metrics per month on a rolling basis.</p>
																	<i></i>
															</div>
													</div>
												</span>
                      </h3>
                    </div>
                    <div class="card-grid-item-footer">
                      <div class="meta" style="text-align: left;">
                        <table>
                          <tr>
                            <th>Total Posts</th>
                            <td>&emsp14;&nbsp; {{ instagram_data.insights.posts.posts_count }}</td>
                          </tr>
                          <tr>
                            <th>New Posts</th>
                            <td>&emsp14;&nbsp; {{ instagram_data.insights.posts.posts_gain }}</td>
                          </tr>
                          <tr>
                            <th>Avg Views</th>
                            <td>&emsp14;&nbsp; {{ instagram_data.general.average_views }}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </a>
                </div>

                <div class="column is-3 insight-card">
                  <a href="#" class="card-grid-item">
                    <div class="card-grid-item-body" style="background: #FF8080; justify-content:center;color:white;">
                      <h3 class="dark-inverted">
                        Engagement Rate (ER)
												<span style="margin-left: 5px;">
													<div class="btn btn-primary tooltip" id="tooltip-short">
															<i class="fas fa-info-circle" aria-hidden="true" style="font-size: 10px;"></i>
															<div class="top">
																	<p>Engagement rate metric calculated on a monthly rolling basis.</p>
																	<i></i>
															</div>
													</div>
												</span>
                      </h3>
                    </div>
                    <div class="card-grid-item-footer">
                      <div class="meta" style="text-align: left;">
                        <table>
                          <tr>
                            <th>Jun</th>
                            <td>&emsp14; {{ instagram_data.insights.engagement.Jun }}% (Good)</td>
                          </tr>
                          <tr>
                            <th>Jul</th>
                            <td>&emsp14; {{ instagram_data.insights.engagement.Jul }}% ({{ instagram_data.customer.profile_score }})</td>
                          </tr>
                          <tr>
                            <th>Rolling(ER)</th>
                            <td>&emsp14; {{ instagram_data.insights.engagement.Score }}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </a>
                </div>
              </TransitionGroup>
            </div>
            <!-- MOST LIKED & ENGAGED POST CARD -->
            <div class="card-grid card-grid-v1">
              <TransitionGroup name="list" tag="div" class="columns is-multiline">
                <!-- MOST LIKED POST -->
                <div class="column is-6">
                  <div class="card-grid-item">
										<div class="card-grid-item-body">
											<div class="left"><h3 style="margin-left: 3px;">
												Most Engaging Post
												<span style="margin-right: 5px;">
													<div class="btn btn-primary tooltip">
															<i class="fas fa-info-circle" aria-hidden="true" style="font-size: 11px;"></i>
															<div class="top">
																	<p>Refers to the post to which large amount of people are engaging/liking.</p>
																	<i></i>
															</div>
													</div>
												</span>
												</h3></div>
											<div class="right">
                        <small>{{ instagram_data.general.most_engaging_post.timestamp }}</small><br>
                        <small>{{ instagram_data.general.most_engaging_post.time }}</small>
                      </div>
										</div>
                    <div class="card-grid-item-body">
                      <!-- CARD BODY -->
                      <img
                        :src="formatLink(instagram_data.general.most_engaging_post.picture)"
                        alt="Most Engaging post"
                        style="width: 100%; height: 350px; border: 2px solid #ccc;"
                      />
                    </div>
                    <div class="card-grid-item-footer">
                      <div class="left">
                        <i class="iconify" data-icon="feather:thumbs-up" aria-hidden="true"></i> {{ instagram_data.general.most_engaging_post.likes }}
                      </div>
                      <div class="center" style="margin-right: 35px;">
                        <i class="iconify" data-icon="feather:message-circle" aria-hidden="true"></i> {{ instagram_data.general.most_engaging_post.comments }}
                      </div>
											<div class="center" style="margin-right: 35px;">
                        <i class="iconify" data-icon="feather:star" aria-hidden="true"></i> ER {{ instagram_data.general.most_engaging_post.engagement }}%
                      </div>
                      <div class="right">
                        <i class="iconify" data-icon="feather:eye" aria-hidden="true"></i> {{ instagram_data.general.most_engaging_post.views }}
                      </div>
                    </div>
                  </div>
                </div>
                <!-- MOST ENGAGING POST -->
                <div class="column is-6">
                  <div class="card-grid-item">
                    <div class="card-grid-item-body">
											<div class="left"><h3 style="margin-left: 3px;">
												Most Commented Post
												<span style="margin-right: 5px;">
													<div class="btn btn-primary tooltip">
															<i class="fas fa-info-circle" aria-hidden="true" style="font-size: 11px;"></i>
															<div class="top">
																	<p>Refers to the post to which large amount of people are doing comments.</p>
																	<i></i>
															</div>
													</div>
												</span>
												</h3></div>
											<div class="right">
                        <small>{{ instagram_data.general.most_commented_post.timestamp }}</small><br>
                        <small>{{ instagram_data.general.most_commented_post.time }}</small>
                      </div>
										</div>
                    <div class="card-grid-item-body">
                      <!-- Card Body -->
                      <img
                        :src="formatLink(instagram_data.general.most_commented_post.picture)"
                        alt="Most Engaging post"
                        style="width: 100%; height: 350px; border: 2px solid #ccc;"
                      />
                    </div>
                    <div class="card-grid-item-footer">
                      <div class="left">
                        <i class="iconify" data-icon="feather:thumbs-up" aria-hidden="true"></i> {{ instagram_data.general.most_commented_post.likes }}
                      </div>
                      <div class="center">
                        <i class="iconify" data-icon="feather:message-circle" aria-hidden="true"></i> {{ instagram_data.general.most_commented_post.comments }}
                      </div>
                      <div class="right">
                        <i class="iconify" data-icon="feather:eye" aria-hidden="true"></i> {{ instagram_data.general.most_commented_post.views }}
                      </div>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </VCard>

					<!-- --------------------------------------------------- -->
				 	  <!-- ...TIKTOK PROFILE INFORMATION CARDS DOWN HERE... -->
					<!-- --------------------------------------------------- -->

          <!-- TIKTOK INSIGHTS CARD -->
          <VCard radius="small" elevated v-if="currentFlow === 'tiktok'" style="margin-top: -32px; border-radius: 0px;">
            <h3 class="title is-5 mb-2" style="color:white;">Tiktok Insights</h3>
            <!-- INSIGHTS GROUP CARD -->
						<div class="mask-left"></div>
            <div class="card-grid card-grid-v4 mb-5">
              <TransitionGroup name="list" tag="div" class="columns is-multiline">
                <!--Grid item-->
                <div class="column is-3 insight-card">
                  <a href="#" class="card-grid-item">
                    <div class="card-grid-item-body" style="background:#808080;color:white;justify-content:center;">
                      <h3 class="dark-inverted">
                        Follower Growth
												<span style="margin-left: 5px;">
													<div class="btn btn-primary tooltip" id="tooltip-short">
															<i class="fas fa-info-circle" aria-hidden="true" style="font-size: 10px;"></i>
															<div class="top">
																	<p>Shows the growth in followers month over month.</p>
																	<i></i>
															</div>
													</div>
												</span>
                      </h3>
                    </div>
                    <div class="card-grid-item-footer">
                      <div class="meta" style="text-align: left;">
                        <table>
                          <tr>
                            <th>Followers</th>
                            <td>&emsp14; {{ tiktok_data.insights.followers.followers_count }}</td>
                          </tr>
                          <tr>
                            <th>Gain</th>
                            <td>&emsp14; {{ tiktok_data.insights.followers.followers_gain }}</td>
                          </tr>
                          <tr>
                            <th>Growth</th>
                            <td>&emsp14; {{ tiktok_data.insights.followers.growth }}%</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </a>
                </div>

                <div class="column is-3 insight-card">
                  <a href="#" class="card-grid-item">
                    <div class="card-grid-item-body" style="background: rgb(101, 192, 241);justify-content:center;color:white;">
                      <h3 class="dark-inverted">
                        Change in Following
												<span style="margin-left: 5px;">
													<div class="btn btn-primary tooltip" id="tooltip-short">
															<i class="fas fa-info-circle" aria-hidden="true" style="font-size: 10px;"></i>
															<div class="top">
																	<p>Shows the change in number of accounts you follow month over month.</p>
																	<i></i>
															</div>
													</div>
												</span>
                      </h3>
                    </div>
                    <div class="card-grid-item-footer">
                      <div class="meta" style="text-align: left;">
                        <table>
                          <tr>
                            <th>Followings</th>
                            <td>&emsp14; {{ tiktok_data.insights.followings.followings_count }}</td>
                          </tr>
                          <tr>
                            <th>Increase</th>
                            <td>&emsp14; {{ tiktok_data.insights.followings.followings_gain }}</td>
                          </tr>
                          <tr>
                            <th>Growth</th>
                            <td>&emsp14; {{ tiktok_data.insights.followings.growth }}%</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </a>
                </div>

                <div class="column is-3 insight-card">
                  <a href="#" class="card-grid-item">
                    <div class="card-grid-item-body" style="background: #00CC00; justify-content:center;color:white;">
                      <h3 class="dark-inverted">
                        Posts
												<span style="margin-left: 5px;">
													<div class="btn btn-primary tooltip" id="tooltip-short">
															<i class="fas fa-info-circle" aria-hidden="true" style="font-size: 10px;"></i>
															<div class="top">
																	<p>Post Metrics per month on a rolling basis.</p>
																	<i></i>
															</div>
													</div>
												</span>
                      </h3>
                    </div>
                    <div class="card-grid-item-footer">
                      <div class="meta" style="text-align: left;">
                        <table>
                          <tr>
                            <th>Total Posts</th>
                            <td>&emsp14;&nbsp; {{ tiktok_data.insights.posts.posts_count }}</td>
                          </tr>
                          <tr>
                            <th>New Posts</th>
                            <td>&emsp14;&nbsp; {{ tiktok_data.insights.posts.posts_gain }}</td>
                          </tr>
                          <tr>
                            <th>Avg Views</th>
                            <td>&emsp14;&nbsp; {{ tiktok_data.general.average_views }}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </a>
                </div>

                <div class="column is-3 insight-card">
                  <a href="#" class="card-grid-item">
                    <div class="card-grid-item-body" style="background: #FF8080; justify-content:center;color:white;">
                      <h3 class="dark-inverted">
                        Engagement Rate (ER)
												<span style="margin-left: 5px;">
													<div class="btn btn-primary tooltip" id="tooltip-short">
															<i class="fas fa-info-circle" aria-hidden="true" style="font-size: 10px;"></i>
															<div class="top">
																	<p>Engagement rate metric calculated on a monthly rolling basis.</p>
																	<i></i>
															</div>
													</div>
												</span>
                      </h3>
                    </div>
                    <div class="card-grid-item-footer">
                      <div class="meta" style="text-align: left;">
                        <table>
                          <tr>
                            <th>Jun</th>
                            <td>&emsp14; {{ tiktok_data.insights.engagement.Jun }}% (Very Good)</td>
                          </tr>
                          <tr>
                            <th>Jul</th>
                            <td>&emsp14; {{ tiktok_data.insights.engagement.Jul }}% ({{ tiktok_data.customer.profile_score }})</td>
                          </tr>
                          <tr>
                            <th>Rolling(ER)</th>
                            <td>&emsp14; {{ tiktok_data.insights.engagement.Score }}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </a>
                </div>

              </TransitionGroup>
            </div>
            <!-- MOST LIKED & ENGAGED POST CARD -->
            <div class="card-grid card-grid-v1">
              <TransitionGroup name="list" tag="div" class="columns is-multiline">
                <!-- MOST LIKED POST -->
                <div class="column is-6">
                  <div class="card-grid-item">
										<div class="card-grid-item-body">
											<div class="left"><h3 style="margin-left: 3px;">
												Most Engaging Post
												<span style="margin-right: 5px;">
													<div class="btn btn-primary tooltip">
															<i class="fas fa-info-circle" aria-hidden="true" style="font-size: 11px;"></i>
															<div class="top">
																	<p>Refers to the post to which large amount of people are engaging/liking.</p>
																	<i></i>
															</div>
													</div>
												</span>
												</h3></div>
											<div class="right">
                        <small>{{ tiktok_data.general.most_engaging_post.timestamp }}</small><br>
                        <small>{{ tiktok_data.general.most_engaging_post.time }}</small>
                      </div>
										</div>
                    <!-- <div class="card-grid-item-body"> -->
                      <!-- CARD BODY -->
										
										<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@therock/video/7121751192199384366" data-video-id="7121751192199384366" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@therock" href="https://www.tiktok.com/@therock">@therock</a> There are 53 players on an NFL roster. I was always <a title="54" target="_blank" href="https://www.tiktok.com/tag/54">#54</a>. I was good, but not good enough. The flame it lit, the chip it placed, the mentality it created - those things have defined how I walk through life 🏈 👊🏾 #<a title="xfl" target="_blank" href="https://www.tiktok.com/tag/xfl">XFL~</a>#5<a title="54" target="_blank" href="https://www.tiktok.com/tag/54">4</a> <a target="_blank" title="♬ No Excuses - NF" href="https://www.tiktok.com/music/No-Excuses-5000000001470132735">♬ No Excuses - NF</a> </section> </blockquote>

                    <!-- </div> -->
                    <div class="card-grid-item-footer">
                      <div class="left">
                        <i class="iconify" data-icon="feather:thumbs-up" aria-hidden="true"></i> {{ tiktok_data.general.most_engaging_post.likes }}
                      </div>
                      <div class="center" style="margin-right: 35px;">
                        <i class="iconify" data-icon="feather:message-circle" aria-hidden="true"></i> {{ tiktok_data.general.most_engaging_post.comments }}
                      </div>
											<div class="center" style="margin-right: 35px;">
                        <i class="iconify" data-icon="feather:star" aria-hidden="true"></i> ER {{ tiktok_data.general.most_engaging_post.engagement }}%
                      </div>
                      <div class="right">
                        <i class="iconify" data-icon="feather:eye" aria-hidden="true"></i> {{ tiktok_data.general.most_engaging_post.views }}
                      </div>
                    </div>
                  </div>
                </div>
                <!-- MOST ENGAGING POST -->
                <div class="column is-6">
                  <div class="card-grid-item">
                    <div class="card-grid-item-body">
											<div class="left"><h3 style="margin-left: 3px;">
												Most Commented Post
												<span style="margin-right: 5px;">
													<div class="btn btn-primary tooltip">
															<i class="fas fa-info-circle" aria-hidden="true" style="font-size: 11px;"></i>
															<div class="top">
																	<p>Refers to the post to which large amount of people are doing comments.</p>
																	<i></i>
															</div>
													</div>
												</span>
												</h3></div>
											<div class="right">
                        <small>{{ tiktok_data.general.most_commented_post.timestamp }}</small><br>
                        <small>{{ tiktok_data.general.most_commented_post.time }}</small>
                      </div>
										</div>
										
                    <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@therock/video/7022393040451030278" data-video-id="7022393040451030278" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@therock" href="https://www.tiktok.com/@therock">@therock</a> 
										#FACEOFFCHALLENGE IS ON🔥🔥🔥Show us what someone says, does or encourages that sends you into OVERdrive👊🏾💪🏾 #faceoff #strangemusicinc
										<a target="_blank" title="♬ New Music - NF" href="https://sf16-ies-music-va.tiktokcdn.com/obj/tos-useast2a-ve-2774/6da2885371bd451daeb323481aeaaecd">♬ No Excuses - NF</a> </section> </blockquote>

                    <div class="card-grid-item-footer">
                      <div class="left">
                        <i class="iconify" data-icon="feather:thumbs-up" aria-hidden="true"></i> {{ tiktok_data.general.most_commented_post.likes }}
                      </div>
                      <div class="center">
                        <i class="iconify" data-icon="feather:message-circle" aria-hidden="true"></i> {{ tiktok_data.general.most_commented_post.comments }}
                      </div>
                      <div class="right">
                        <i class="iconify" data-icon="feather:eye" aria-hidden="true"></i> {{ tiktok_data.general.most_commented_post.views }}
                      </div>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </VCard>
        </div>

				<!-- WORDCLOUD & HASHTAGS DATA CHART -->
				<div class="card-grid card-grid-v1 mt-3">
						<TransitionGroup name="list" tag="div" class="columns is-multiline">
							<!-- WORDCLOUD CHART -->
							<div class="column is-6">
								<div class="card-grid-item">
									<h2 style="margin-left: 20px; margin-top: 20px; font-size: 17px;">Profile Cloud
										<span style="margin-right: 5px;">
											<div class="btn btn-primary tooltip">
													<i class="fas fa-info-circle" aria-hidden="true" style="font-size: 11px;"></i>
													<div class="top">
															<p>Top keywords by Profile</p>
															<i></i>
													</div>
											</div>
										</span>
									</h2>
									
									<div class="card-grid-item-body" v-if="currentFlow === 'instagram'">
										<InstagramCloudContainer
												:wordcloud-data="instagram_data.customer.wordcloud_data"
											/>
									</div>

									<div class="card-grid-item-body" v-if="currentFlow === 'tiktok'">
										<InstagramCloudContainer
												:wordcloud-data="tiktok_data.customer.wordcloud_data"
											/>
									</div>

								</div>
							</div>

							<!-- HASHTAGS CHART -->
							<div class="column is-6">
								<div class="card-grid-item">
									<h2 style="margin-left: 20px; margin-top: 20px; font-size: 17px;">
										Profile Hashtags
										<span style="margin-right: 5px;">
											<div class="btn btn-primary tooltip">
													<i class="fas fa-info-circle" aria-hidden="true" style="font-size: 11px;"></i>
													<div class="top">
															<p>Contains top 10 hashtags from a list of hastags used by the profile. Those hashtags are sorted according to number of posts.</p>
															<i></i>
													</div>
											</div>
										</span>
									</h2>
									<div class="card-grid-item-body">

										<div class="mt-1" v-if="currentFlow === 'instagram'">
                      <table class="table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Hashtag</th>
                            <th>Views</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr :key="index" v-for="(hashtag, index) in instagram_data.customer.top_hashtags">
                            <td style="width: 100px;">{{ index + 1 }}</td>
                            <td style="width: 200px;">#{{ hashtag.hashtag_name }}</td>
                            <td style="width: 200px;">{{ hashtag.item_count }}</td>
                          </tr>
                        </tbody>
                      </table>
										</div>

										<div class="mt-5" v-if="currentFlow === 'tiktok'">
											<table class="table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Hashtag</th>
                            <th>Views</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr :key="index" v-for="(hashtag, index) in tiktok_data.customer.top_hashtags">
                            <td style="width: 100px;">{{ index + 1 }}</td>
                            <td style="width: 200px;">#{{ hashtag.hashtag_name }}</td>
                            <td style="width: 200px;">{{ hashtag.item_count }}</td>
                          </tr>
                        </tbody>
                      </table>
										</div>

									</div>
								</div>
							</div>
						</TransitionGroup>
				</div>

     </div>
  <!-- </div> -->


</template>

<style lang="scss">

.insta-score {
  background: url("https://images.unsplash.com/photo-1557682257-2f9c37a3a5f3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aW5zdGFncmFtJTIwYmFja2dyb3VuZHxlbnwwfHwwfHw%3D&w=1000&q=80");
  background-size: cover;
  background-position: center;
}

.insta-score p, .tiktok-score p {
  color: #E8E8E8;
}

.insta-score h3, .tiktok-score h3 {
  color: white;
  font-size: 19px;
}

.tiktok-score {
  background: url("https://static.vecteezy.com/system/resources/thumbnails/002/275/651/small/background-in-blue-red-and-black-colors-in-trendy-style-design-free-vector.jpg");
  background-size: cover;
  background-position: center;
}

.tooltip {
    display:inline-block;
    position:relative;
    text-align:left;
}

#tooltip-short {
	top: -7px;
	left: -5%;
}

.tooltip .top {
    min-width:200px; 
    top:-20px;
    left:50%;
    transform:translate(-50%, -100%);
    padding:10px 20px;
    color:#444444;
    background-color:#EEEEEE;
    font-weight:normal;
    font-size:11px;
    border-radius:8px;
    position:absolute;
    z-index:99999999;
    box-sizing:border-box;
    box-shadow:0 1px 8px rgba(0,0,0,0.5);
    visibility:hidden; opacity:0; transition:opacity 0.8s;
}

.tooltip:hover .top {
    visibility:visible; opacity:1;
}

.tooltip .top i {
    position:absolute;
    top:100%;
    left:50%;
    margin-left:-12px;
    width:24px;
    height:12px;
    overflow:hidden;
}

.tooltip .top i::after {
    content:'';
    position:absolute;
    width:12px;
    height:12px;
    left:50%;
    transform:translate(-50%,-50%) rotate(45deg);
    background-color:#EEEEEE;
    box-shadow:0 1px 8px rgba(0,0,0,0.5);
}

.mask-right {
	border-width: 0 0 3px 3px;
	position: relative;
	float: right;
	clear: none;
	right: -4.4%;
	top: -22px;
	background-color: #f0f0f0;
	width: 55%;
	height: 2em;
}

.mask-left {
	border-width: 0 0 3px 3px;
	position: absolute;
	float: right;
	clear: none;
	left: -4%;
	top: 363px;
	background-color: #f0f0f0;
	width: 55%;
	height: 2em;
}

div#instagram:hover {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
  cursor:pointer;
}

div#tiktok:hover {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
  cursor:pointer;
}

div.active-instagram {
  box-shadow: rgba(0, 0, 0, 0.40) 0px 3px 5px;
}

div.active-tiktok {
  box-shadow: rgba(0, 0, 0, 0.40) 0px 3px 5px;
}

div.insight-card {
  text-align: center;
}

a.card-grid-item, div.card-grid-item {
  box-shadow: rgba(0, 0, 0, 0.40) 0px 3px 3px;
}

.card-grid {
  .columns {
    margin-left: -0.5rem !important;
    margin-right: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.5rem !important;
  }
}

.card-grid-v1 {
  .card-grid-item {
    flex: 1;
    display: inline-block;
    width: 100%;
    background-color: var(--white);
    border-radius: 6px;
    border: 1px solid var(--fade-grey-dark-3);
    transition: all 0.3s; // transition-all test

    .card-grid-item-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid var(--fade-grey-dark-3);

      .left {
        display: flex;
        align-items: center;

        .meta {
          margin-left: 12px;
          line-height: 1.3;

          span {
            display: block;

            &:first-child {
              font-size: 1.1rem;
              font-weight: 600;
              font-family: var(--font-alt);
              color: var(--dark-text);
            }

            &:nth-child(2) {
              font-family: var(--font);
              font-size: 0.85rem;
              color: var(--light-text);
            }
          }
        }
      }

      .right {
        .social-links {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .social-link {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 32px;
            width: 32px;
            min-width: 32px;
            border-radius: 50%;
            border: 1px solid var(--fade-grey-dark-3);
            margin: 0 4px;
            color: var(--primary);
            box-shadow: var(--light-box-shadow);
            transition: all 0.3s; // transition-all test

            &:hover {
              color: var(--white);
              background: var(--primary);
              border-color: var(--primary);
              box-shadow: var(--primary-box-shadow);
            }

            i {
              font-size: 12px;
            }
          }
        }
      }
    }

    .card-grid-item-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;

      .left {
        flex-grow: 2;
        max-width: 50%;

        .progress-stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;

          span {
            display: block;

            &:first-child {
              font-family: var(--font-alt);
              font-size: 0.9rem;
              font-weight: 600;
              color: var(--dark-text);
            }

            &:nth-child(2) {
              font-size: 0.9rem;
              color: var(--light-text);
            }
          }
        }

        .progress {
          margin-bottom: 0;
        }
      }

      .right {
        .v-button {
          color: var(--light-text);

          &:hover,
          &:focus {
            border-color: var(--primary);
            background: var(--primary);
            color: var(--smoke-white);
            box-shadow: var(--primary-box-shadow);
          }
        }
      }
    }
  }
}

.is-dark {
  .card-grid-v1 {
    .card-grid-item {
      background: var(--dark-sidebar-light-6);
      border-color: var(--dark-sidebar-light-12);

      .card-grid-item-body {
        border-color: var(--dark-sidebar-light-12);

        .left {
          .v-avatar {
            .badge {
              border-color: var(--dark-sidebar-light-6);
            }
          }
        }

        .right {
          .social-links {
            .social-link {
              background: var(--dark-sidebar-light-2);
              border-color: var(--dark-sidebar-light-12);
              color: var(--dark-dark-text);

              &:hover,
              &:focus {
                border-color: var(--primary) !important;
                color: var(--primary) !important;
              }
            }
          }
        }
      }

      .card-grid-item-footer {
        .right {
          .v-button {
            box-shadow: none !important;
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .card-grid-v1 {
    .card-grid-item {
      .card-grid-item-body {
        flex-direction: column;

        .left {
          flex-direction: column;
          text-align: center;

          .meta {
            margin: 5px 0 20px;
          }
        }
      }
    }
  }
}

.loader-wrap {
  background-size: cover;
  background-color: rgba(30, 144, 255, 0.1);
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10000000000;
  top: 0;
  left: 0;
  border-radius: 5px;
}
.loader {
  background-color: transparent;
  border: 0px;
  //margin-top: 300px;
  position: fixed;
  top: 45%;
}

.loader.button.is-loading::after {
  animation: spinAround 0ms infinite linear;
  color: white;
  border-width: 4px;
  border-bottom-color: white;
  border-left-color: white;
  font-size: 50px;
  font-weight: bolder;
}
</style>