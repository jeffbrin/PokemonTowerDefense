export default class StateStack
{
	constructor()
	{
		this.states = [];
	}

	update(dt)
	{
		if (this.top() && this.top() != null)
		{
			this.top().update(dt);
		}

	}

	render(context)
	{
		this.states.forEach((state) => state.render(context));
	}

	push(state)
	{
		if(this.top())
			this.top().tempExit();
		this.states.push(state);
		this.top().enter();
	}

	pop()
	{
		this.top().exit();
		const removed = this.states.splice(this.states.length - 1, 1)[0];

		// Call reenter on top
		if(this.top());
			this.top().reenter();
			
		return removed;
	}

	top()
	{
		return this.states[this.states.length - 1];
	}

	clear()
	{
		this.states = [];
	}
}
