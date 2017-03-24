<template>
	<div class="pagination">
			<div class="pagination__left">
				<a v-if="hasPrev()" href="#" @click="changePage(prevPage)">Previous</a>
			</div>
			<div class="pagination__mid">
				<ul>
					
					<li v-for="page in pages">
						<a href="#" @click="changePage(page)" :class="{ current: current == page}"> {{ page }}</a>
					</li>
					<li>
						<input type="text" @keyup.enter='findPage' placeholder="№" class="form-control page_number">
					</li>
				</ul>
			</div>
			<div class="pagination__right">
				<a v-if="hasNext()" href="#" @click="changePage(nextPage)">Next</a>
			</div>
		</div>
</template>

<script>
	
export default { 
	name: 'pagination',
	props: {
    	offset: {
	      type: Number,
	      default: 0
	    },
	    perPage: {
	      type: Number,
	      default: 30
	    },
	    current: {
	    	type: Number,
	    	default: 1
	    },
	    pageRange: {
	      type: Number,
	      default: 3
	    }
  	},
	  computed: {
	    pages: function() {
	      var pages = []

	      for(var i = this.rangeStart; i <= this.rangeEnd; i++) {
	        pages.push(i)
	      }

	      return pages
	    },
	    rangeStart: function() {
	      var start = this.current - this.pageRange

	      return (start > 0) ? start : 1
	    },
	    rangeEnd: function() {
	      var end = this.current + this.pageRange

	      return end
	    },
	    nextPage: function() {
	      return this.current + 1
	    },
	    prevPage: function() {
	      return this.current - 1
	    }
	  },
	  methods: {
	    hasFirst: function() {
	      return this.rangeStart !== 1
	    },
	    hasPrev: function() {
	      return this.current > 1
	    },
	    hasNext: function() {
	      return true
	    },
	    changePage: function(page) {
	      this.$emit('page-changed', page)
	    },
	    findPage: function(e) {
	    	this.$emit('page-changed',parseInt(e.target.value))
	    }
	  }
	}

</script>
<style type="text/css">
	/* Пагинация */
.pagination {
  width: 100%;
  height: 44px;
  display: flex;
  justify-content: space-between;
  margin: 30px auto 30px;
  padding: 0 15px;
  max-width: 1280px;
}

.pagination__left, .pagination__right {
  width: 20%;
}

.pagination__left {
  float: left;
}

.pagination__right {
  float: right;
}

.pagination__right a {
  float: right;
}

.pagination a, .pagination span {
  display: block;
  text-align: center;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: 300;
  line-height: 42px;
  height: 44px;
  color: #999;
  font-size: 18px;
}

.pagination a {
  padding: 0 20px;
  max-width: 160px;
  background-color: transparent;
  border-radius: 4px;
  border: 1px solid #ccc;
  text-decoration: none;
  margin: 0 6px;
  transition: all .2s ease-in-out;
}

.pagination a:hover, .pagination a.current {
  border-color: #ea4c89;
  color: #ea4c89;
}

.pagination__mid {
  display: flex;
  justify-content: center;
  width: 60%;
}

.pagination__mid ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pagination__mid li {
  display: inline-block;
}
.page_number {
	width: 50%
}
</style>