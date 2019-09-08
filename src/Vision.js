import React from 'react';
import {Helmet} from "react-helmet";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const styleSheet = theme => ({
  root: {
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
	},
	content: {
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    maxWidth: theme.spacing.unit * 160,
    margin: 'auto',
	},
});

class Vision extends React.Component {

	render() {
		const { classes } = this.props;

		const title = "インフルず　ビジョン"
		const description = "インフルずは「邪魔な広告を消したい!」その為には広告よりも良いオススメまとめサイトを作れば良いんだ! という発想から生まれたサイトです。本当に人にオススメできる情報だけ集まるサイトを目指しています。"

		return (
			<div className={classes.root}>
				<Helmet>
					<title>{title}</title>
					<meta name="description" content={description} />
					<meta name="og:image" content="http://www.tokishirazu.llc/img/influs.png" />
					<meta name="og:url" content={this.props.location} />
					<meta name="og:type" content="website" />
					<meta name="og:title" content={title}/>
					<meta name="og:description" content={description}/>
					<meta name="og:site_name" content="「これいいよ!」でつながるオススメまとめサイト インフルず(β)" />
					<meta name="twitter:card" content="summary" />
					<meta name="fragment" content="1" />
				</Helmet>
				<div className={classes.content}>
					<Typography
						variant="headline"
						component="h2"
						gutterBottom
					>
						無料と広告の間で...
					</Typography>
					<Typography variant="body1">
						「この広告消せないかな?」<br />
						忙しく多くの情報で溢れかえるこの現代社会<br />
						調べ物をしていて、強制的に割り込まれる広告にそう思うことがあります。<br />
						動画サイトやSNS、ニュースサイトなど、便利なサービスが増える一方で、
						ほとんど関心のない広告が私たちのプライベートな空間へと足を踏み入れ、容赦無く時間を奪っていきます。<br />
					</Typography>
				</div>
				<Divider />
				<div className={classes.content}>
					<Typography
						variant="headline"
						component="h2"
						gutterBottom
					>
						下がり続けるコンバージョンレート
					</Typography>
					<Typography variant="body1">
						さらに状況は悪くなっています。<br />
						巷には多くの無料で有用なコンテンツサイトが溢れかり、
						広告の単価は勢いよく下がり続けています。<br />
						そしてますます多くのサイトやアプリが広告収入に依存しています。<br />
					</Typography>
				</div>
				<Divider />
				<div className={classes.content}>
					<Typography
						variant="headline"
						component="h2"
						gutterBottom
					>
						「この動画みてxx買ったよー」
					</Typography>
					<Typography variant="body1">
						YoutuberやSNSの普及により、インフルエンサーと呼ばれる人たちが登場しました。<br />
						インフルエンサーが何かを使うと、その影響でみんな同じものが欲しくなるのです。<br />
						しかし、広告業界では「インフルエンサーにお金を払って紹介してもらう」と今までと変わらないことを続けています。<br />
						一体何が問題でしょうか?<br />
					</Typography>
				</div>
				<Divider />
				<div className={classes.content}>
					<Typography
						variant="headline"
						component="h2"
						gutterBottom
					>
						本当にオススメのものを紹介すれば良い!
					</Typography>
					<Typography variant="body1">
						このサイトでは「自信を持って良いとオススメできるもの」<br />
						もしくは「実際に使っているもの」をだけを紹介するというアプローチを取っています。<br />
						「気に入ったものは応援したい」「良いものは評価されるべき」<br />
						もしあなたが共感してくれるのであれば、ぜひこのサイトを利用してください。<br />
					</Typography>
					<Typography variant="body1">
						このサイトのコンセプトはシンプルです。<br />
					</Typography>
					<Typography variant="body1">
						「これいいよ!」<br />
						「これいいね!」<br />
						「これどうよ?」<br />
					</Typography>
					<Typography variant="body1">
						これだけです。<br />
					</Typography>
					<Typography variant="body1">
						さあ、あなたは今まで通り、知らない誰かの広告だらけの世界で生きていきますか?<br />
						それとも自信を持って誰かにオススメしますか?<br />
					</Typography>
					<Typography variant="body1">
						「広告」ではなく「オススメ」を。<br />
						知らない誰かのクチコミではなく、<br />
						知ってるあの人のレビューを。<br />
					</Typography>
				</div>
			</div>
		);
	}
}
Vision.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Vision);

