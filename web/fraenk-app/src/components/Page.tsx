import type { TreeNode } from '../interfaces/TreeNode.tsx';

const Page = (node : TreeNode) => {

    const props = node.props || { "value":"" };

    return <div className="pageBody">{props.value}</div>

}

export default Page;
