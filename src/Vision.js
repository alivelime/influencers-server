import React from 'react';
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

		return (
			<div className={classes.root}>
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
					<Typography variant="body1">
						広告とはユーザーにとっては実に迷惑なものです。<br />
						ビデオレコーダーが開発された当初はCMをスキップするかしないかという論争がありましたし、<br />
						有料会員になれば広告を表示しないというサイトもあります。<br />
						まとめ系アフィリサイトやステマなど広告には多くの課題があります。<br />
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
					<Typography variant="body1">
						しかし、なぜ嫌われているはずの広告に企業は多くのお金を費やすのでしょうか?<br />
						YoutuberやSNSの台頭により、時代は変わりつつあるというのに。<br />
						広告は未だに「興味のないものを無理やりインフルエンサーに使わせる」という<br />
						テレビや雑誌と同じことを繰り返しています。<br />
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
						「前回のパート見て、同じスポーツカー(実車)買ったよ」<br />
						これはとあるゲーム実況動画で私が目にしたコメントです。<br />
						ランキング上位にある人気のゲーム実況動画で、内容はゲーム内の仮想のアメリカ大陸をドライブしながら
						VOICEROID達がわいわいおしゃべりするといった感じでした。<br />
						そんなゲーム動画を見て、ゲームに出てきた車を実際に購入した視聴者がいたというのです。<br />
					</Typography>
					<Typography variant="body1">
						これは本当の話でしょうか?<br />
						多分、私の見間違えかなんかでしょう。<br />
					</Typography>
					<Typography variant="body1">
						これが本当の話かどうかはどうでもいいことです。<br />
						重要なことは「誰もがフォロワーに影響力を与える」ということです。<br />
						実際、多くの動画で「撮影機材何使ってますか?」とか<br />
						「着ている服どこで買ったの?」といったコメントを見かけることができます。<br />
					</Typography>
					<Typography variant="body1">
						特別なことをしなくても、あなたが好きな事、詳しい事、得意な事、を自信を持って売ればいいのです。<br />
						あなたのフォロワーはそれを求めているのですから。<br />
					</Typography>
				</div>
				<Divider />
				<div className={classes.content}>
					<Typography
						variant="headline"
						component="h2"
						gutterBottom
					>
						そして誰もがインフルエンサーである時代へ
					</Typography>
					<Typography variant="body1">
						このサイトでは「あなたが自信を持って良いとオススメできるもの」<br />
						もしくは「実際に使っているもの」をだけを紹介してください。<br />
						あなたが良いと思うものは、あなたのフォロワーが買ってくれます。<br />
						あなたが自身があなたの好きなものの広告代理人になるのです。<br />
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

